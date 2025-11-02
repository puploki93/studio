/**
 * @fileOverview Music API integration for fetching real track data from Spotify, SoundCloud, etc.
 */

export interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  album?: string;
  bpm?: number;
  key?: string;
  energy?: number; // 0-1
  danceability?: number; // 0-1
  valence?: number; // 0-1 (positivity)
  duration: number; // milliseconds
  genres?: string[];
  releaseDate?: string;
  popularity?: number; // 0-100
  previewUrl?: string;
  albumArt?: string;
  spotifyUri?: string;
  soundcloudUrl?: string;
}

export interface PlaylistData {
  id: string;
  name: string;
  description?: string;
  tracks: TrackMetadata[];
  totalTracks: number;
  owner?: string;
  public?: boolean;
  collaborative?: boolean;
}

export interface SearchResult {
  tracks: TrackMetadata[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * Spotify Web API Integration
 * Requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables
 */
export class SpotifyAPI {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Get new token using client credentials flow
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error(
        'Spotify credentials not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.'
      );
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Spotify auth failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // Refresh 1 min early

    return this.accessToken;
  }

  /**
   * Search for tracks on Spotify
   */
  async searchTracks(query: string, limit: number = 10): Promise<SearchResult> {
    const token = await this.getAccessToken();
    const params = new URLSearchParams({
      q: query,
      type: 'track',
      limit: limit.toString(),
    });

    const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      tracks: data.tracks.items.map((item: any) => this.parseSpotifyTrack(item)),
      total: data.tracks.total,
      offset: data.tracks.offset,
      limit: data.tracks.limit,
    };
  }

  /**
   * Get track details including audio features
   */
  async getTrackDetails(trackId: string): Promise<TrackMetadata> {
    const token = await this.getAccessToken();

    // Get basic track info
    const trackResponse = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!trackResponse.ok) {
      throw new Error(`Failed to get track: ${trackResponse.statusText}`);
    }

    const track = await trackResponse.json();

    // Get audio features (BPM, key, energy, etc.)
    const featuresResponse = await fetch(
      `https://api.spotify.com/v1/audio-features/${trackId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const features = featuresResponse.ok ? await featuresResponse.json() : null;

    return this.parseSpotifyTrack(track, features);
  }

  /**
   * Get playlist tracks
   */
  async getPlaylist(playlistId: string): Promise<PlaylistData> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      throw new Error(`Failed to get playlist: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      tracks: data.tracks.items.map((item: any) =>
        this.parseSpotifyTrack(item.track)
      ),
      totalTracks: data.tracks.total,
      owner: data.owner.display_name,
      public: data.public,
      collaborative: data.collaborative,
    };
  }

  /**
   * Get audio analysis for a track
   */
  async getAudioAnalysis(trackId: string): Promise<any> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/audio-analysis/${trackId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      throw new Error(`Failed to get audio analysis: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get recommendations based on seed tracks
   */
  async getRecommendations(params: {
    seedTracks?: string[];
    seedArtists?: string[];
    seedGenres?: string[];
    targetBpm?: number;
    targetKey?: number;
    targetEnergy?: number;
    limit?: number;
  }): Promise<TrackMetadata[]> {
    const token = await this.getAccessToken();

    const searchParams = new URLSearchParams();
    if (params.seedTracks) searchParams.set('seed_tracks', params.seedTracks.join(','));
    if (params.seedArtists) searchParams.set('seed_artists', params.seedArtists.join(','));
    if (params.seedGenres) searchParams.set('seed_genres', params.seedGenres.join(','));
    if (params.targetBpm) searchParams.set('target_tempo', params.targetBpm.toString());
    if (params.targetKey !== undefined) searchParams.set('target_key', params.targetKey.toString());
    if (params.targetEnergy) searchParams.set('target_energy', params.targetEnergy.toString());
    searchParams.set('limit', (params.limit || 10).toString());

    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?${searchParams}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tracks.map((track: any) => this.parseSpotifyTrack(track));
  }

  private parseSpotifyTrack(track: any, features?: any): TrackMetadata {
    // Convert Spotify pitch class to musical key
    const pitchToKey = (pitch: number, mode: number): string => {
      const keys = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
      const key = keys[pitch];
      return mode === 1 ? key : `${key}m`;
    };

    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      album: track.album?.name,
      bpm: features?.tempo ? Math.round(features.tempo) : undefined,
      key: features?.key !== undefined && features?.mode !== undefined
        ? pitchToKey(features.key, features.mode)
        : undefined,
      energy: features?.energy,
      danceability: features?.danceability,
      valence: features?.valence,
      duration: track.duration_ms,
      popularity: track.popularity,
      previewUrl: track.preview_url,
      albumArt: track.album?.images?.[0]?.url,
      spotifyUri: track.uri,
      releaseDate: track.album?.release_date,
    };
  }
}

/**
 * SoundCloud API Integration
 * Note: SoundCloud API access is restricted. This is a placeholder for when access is available.
 */
export class SoundCloudAPI {
  private clientId: string;

  constructor(clientId?: string) {
    this.clientId = clientId || process.env.SOUNDCLOUD_CLIENT_ID || '';
  }

  async searchTracks(query: string, limit: number = 10): Promise<SearchResult> {
    if (!this.clientId) {
      throw new Error('SoundCloud client ID not configured');
    }

    // Placeholder - SoundCloud API implementation
    throw new Error('SoundCloud API integration pending');
  }

  async getTrackDetails(trackId: string): Promise<TrackMetadata> {
    throw new Error('SoundCloud API integration pending');
  }
}

/**
 * Unified music API service
 */
export class MusicAPIService {
  private spotify: SpotifyAPI;
  private soundcloud: SoundCloudAPI;

  constructor() {
    this.spotify = new SpotifyAPI();
    this.soundcloud = new SoundCloudAPI();
  }

  /**
   * Search across available services
   */
  async search(
    query: string,
    options: {
      service?: 'spotify' | 'soundcloud' | 'all';
      limit?: number;
    } = {}
  ): Promise<SearchResult> {
    const { service = 'spotify', limit = 10 } = options;

    if (service === 'spotify' || service === 'all') {
      return await this.spotify.searchTracks(query, limit);
    }

    if (service === 'soundcloud') {
      return await this.soundcloud.searchTracks(query, limit);
    }

    throw new Error(`Unknown service: ${service}`);
  }

  /**
   * Get detailed track info
   */
  async getTrack(trackId: string, service: 'spotify' | 'soundcloud' = 'spotify'): Promise<TrackMetadata> {
    if (service === 'spotify') {
      return await this.spotify.getTrackDetails(trackId);
    }
    return await this.soundcloud.getTrackDetails(trackId);
  }

  /**
   * Get AI-powered track recommendations
   */
  async getRecommendations(params: {
    seedTracks?: string[];
    genre?: string;
    bpm?: number;
    energy?: number;
    limit?: number;
  }): Promise<TrackMetadata[]> {
    return await this.spotify.getRecommendations({
      seedTracks: params.seedTracks,
      targetBpm: params.bpm,
      targetEnergy: params.energy,
      limit: params.limit,
    });
  }

  getSpotify(): SpotifyAPI {
    return this.spotify;
  }

  getSoundCloud(): SoundCloudAPI {
    return this.soundcloud;
  }
}

// Export singleton instance
export const musicAPI = new MusicAPIService();
