'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateMoodBasedPlaylist,
  type GenerateMoodBasedPlaylistOutput,
} from '@/ai/flows/generate-mood-based-playlist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { List, Music, Loader2, Wand2 } from 'lucide-react';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  mood: z.string().min(10, {
    message: 'Describe the mood in at least 10 characters.',
  }),
});

export function PlaylistGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [playlist, setPlaylist] = React.useState<GenerateMoodBasedPlaylistOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPlaylist(null);
    try {
      const result = await generateMoodBasedPlaylist(values);
      setPlaylist(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error generating playlist',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <span>Universal Playlist Intelligence</span>
        </CardTitle>
        <CardDescription>Generate a playlist based on any mood, event, or context.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mood or Context</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'A rainy day in a cyberpunk city' or 'An upbeat 80s synthwave workout'"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Playlist'
              )}
            </Button>
          </form>
        </Form>

        {playlist && (
          <div className="mt-6 space-y-4">
            <Separator />

            {/* Playlist Overview */}
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Playlist Vibe</h3>
              <p className="text-sm text-muted-foreground">{playlist.playlistDescription}</p>
            </div>

            {/* Genre Blend & Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Genre Blend</h4>
                <div className="flex flex-wrap gap-1">
                  {playlist.genreBlend.map((genre, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Average BPM</h4>
                <p className="text-2xl font-bold text-accent">{Math.round(playlist.avgBpm)}</p>
              </div>
            </div>

            {/* Energy Curve */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Energy Flow</h4>
              <p className="text-sm text-muted-foreground">{playlist.energyCurve}</p>
            </div>

            {/* Tracklist with Details */}
            <div className="space-y-2">
              <h3 className="font-semibold text-accent flex items-center gap-2">
                <List />
                Tracklist
              </h3>
              <div className="space-y-2">
                {playlist.songs.map((song, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Music className="h-4 w-4 text-accent/80 flex-shrink-0" />
                        <span className="font-medium text-sm truncate">{song.title}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-primary">{song.bpm} BPM</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-accent">Key: {song.key}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          Energy: <span className="font-semibold">{song.energy}/10</span>
                        </span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                          {song.genre}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
