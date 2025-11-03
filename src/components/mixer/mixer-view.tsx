import { Deck } from "./deck";
import { Card, CardContent } from "../ui/card";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";

export function MixerView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-2">
        <Deck
          deckId="A"
          trackTitle="Cosmic Echoes"
          artistName="Galaxy Rider"
          albumArtId="album-art-2"
          bpm={128}
        />
      </div>
      
      <div className="lg:col-span-1">
        <Card className="h-full bg-card/50 flex flex-col justify-between">
          <CardContent className="p-4 flex flex-col gap-4 justify-center flex-1">
             <div className="space-y-2">
                <p className="text-center text-xs text-muted-foreground">MASTER</p>
                <Slider defaultValue={[75]} />
            </div>
            <div className="space-y-2">
                <p className="text-center text-xs text-muted-foreground">DECK A</p>
                <Slider defaultValue={[80]} />
            </div>
             <div className="space-y-2">
                <p className="text-center text-xs text-muted-foreground">DECK B</p>
                <Slider defaultValue={[80]} />
            </div>
             <div className="flex justify-between items-center text-sm font-bold">
                 <span>A</span>
                 <span>B</span>
             </div>
             <Slider defaultValue={[50]} className="[&>span>span]:bg-primary" />
             <div className="flex justify-center gap-2">
                 <Button size="sm" variant="outline">CUE A</Button>
                 <Button size="sm" variant="outline">CUE B</Button>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Deck
          deckId="B"
          trackTitle="Neon Drive"
          artistName="Future Funk"
          albumArtId="album-art-3"
          bpm={128}
        />
      </div>
    </div>
  );
}
