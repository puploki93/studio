import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Music } from "lucide-react";

const streamingServices = [
  { name: 'Spotify', icon: '🎵' },
  { name: 'Apple Music', icon: '🍎' },
  { name: 'SoundCloud', icon: '☁️' },
  { name: 'TIDAL', icon: '🌊' },
  { name: 'YouTube Music', icon: '▶️' },
  { name: 'Local Files', icon: '📁' },
];

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-primary">Library & Streaming</h1>
        <p className="text-muted-foreground">Connect your music sources and manage your tracks.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {streamingServices.map((service) => (
          <Card key={service.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">{service.icon}</span>
                <span>{service.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription>
                Connect your {service.name} account to sync playlists, liked songs, and followed artists.
              </CardDescription>
            </CardContent>
            <div className="p-4 pt-0">
               <Button className="w-full">Connect</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
