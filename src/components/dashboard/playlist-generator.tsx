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
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Playlist Vibe</h3>
              <p className="text-sm text-muted-foreground">{playlist.playlistDescription}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-accent flex items-center gap-2">
                <List />
                Tracklist
              </h3>
              <ul className="space-y-2">
                {playlist.songs.map((song, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Music className="h-4 w-4 text-accent/80" />
                    <span>{song}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
