import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface DeckProps {
  deckId: 'A' | 'B';
  trackTitle: string;
  artistName: string;
  albumArtId: string;
  bpm: number;
}

const Waveform = () => (
    <div className="relative h-16 w-full overflow-hidden rounded-md bg-secondary/50">
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        <path d="M0,32 C20,10 40,50 60,32 S100,10 120,32 S160,50 180,32 S220,10 240,32 S280,50 300,32 L300,64 L0,64 Z" fill="url(#grad1)" transform="scale(2.7 1)"></path>
      </svg>
    </div>
);


export function Deck({ deckId, trackTitle, artistName, albumArtId, bpm }: DeckProps) {
  const albumArt = PlaceHolderImages.find(p => p.id === albumArtId)?.imageUrl || "https://picsum.photos/seed/101/200/200";

  return (
    <Card className="overflow-hidden shadow-lg shadow-primary/5">
      <CardHeader className="flex-row items-start gap-4 p-4">
        <Image
          src={albumArt}
          alt={`Album art for ${trackTitle}`}
          width={80}
          height={80}
          className="aspect-square rounded-md object-cover"
          data-ai-hint="album art"
        />
        <div className="flex-1 space-y-1">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-primary">{`DECK ${deckId}`}</h3>
                <Badge variant="secondary">{bpm} BPM</Badge>
            </div>
            <p className="font-semibold">{trackTitle}</p>
            <p className="text-sm text-muted-foreground">{artistName}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <Waveform />
        <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
                <label className="text-xs text-muted-foreground">HIGH</label>
                <Slider defaultValue={[80]} />
            </div>
             <div className="space-y-1">
                <label className="text-xs text-muted-foreground">MID</label>
                <Slider defaultValue={[50]} />
            </div>
             <div className="space-y-1">
                <label className="text-xs text-muted-foreground">LOW</label>
                <Slider defaultValue={[60]} />
            </div>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/50 p-2 flex gap-2">
        <Button className="flex-1" variant="default">PLAY</Button>
        <Button className="flex-1" variant="outline">CUE</Button>
        <Button className="flex-1" variant="outline">SYNC</Button>
      </CardFooter>
    </Card>
  );
}
