'use client';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Slider } from '../ui/slider';
import { SkipBack, Play, SkipForward, Mic2, ListMusic, Laptop2, Volume2, Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';

export function PlayerControls() {
    const [track, setTrack] = useState({
        title: "Cyberdream",
        artist: "Synthwave Rider",
        albumArt: PlaceHolderImages.find(p => p.id === 'album-art-1')?.imageUrl || "https://picsum.photos/seed/101/100/100"
    });
    const [progress, setProgress] = useState(30);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(p => (p >= 100 ? 0 : p + 1));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);


    return (
        <footer className="sticky bottom-0 z-20 mt-auto border-t bg-background/95 backdrop-blur-sm">
            <div className="grid h-24 grid-cols-3 items-center px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <Image
                        src={track.albumArt}
                        alt="Album Art"
                        width={56}
                        height={56}
                        className="aspect-square rounded-md object-cover"
                        data-ai-hint="abstract neon"
                    />
                    <div className="hidden flex-col md:flex">
                        <p className="font-semibold truncate">{track.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <SkipBack className="h-5 w-5"/>
                        </Button>
                        <Button variant="default" size="icon" className="h-10 w-10 bg-primary text-primary-foreground rounded-full" onClick={() => setIsPlaying(!isPlaying)}>
                            <Play className={`h-6 w-6 ${isPlaying ? 'fill-current' : ''}`}/>
                        </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                            <SkipForward className="h-5 w-5"/>
                        </Button>
                    </div>
                    <div className="flex w-full max-w-xs items-center gap-2 text-xs">
                        <span>{Math.floor(progress * 1.8)}s</span>
                        <Slider value={[progress]} max={100} step={1} className="w-full" onValueChange={(value) => setProgress(value[0])}/>
                        <span>3:00</span>
                    </div>
                </div>
                
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="hidden lg:flex">
                        <Mic2 />
                    </Button>
                     <Button variant="ghost" size="icon" className="hidden lg:flex">
                        <ListMusic />
                    </Button>
                     <Button variant="ghost" size="icon" className="hidden lg:flex">
                        <Laptop2 />
                    </Button>
                    <div className="hidden items-center gap-2 md:flex">
                        <Button variant="ghost" size="icon">
                            <Volume2 />
                        </Button>
                        <Slider defaultValue={[50]} max={100} step={1} className="w-24"/>
                    </div>
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                        <Maximize2 />
                    </Button>
                </div>
            </div>
        </footer>
    )
}
