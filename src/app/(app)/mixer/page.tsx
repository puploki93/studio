import { MixerView } from "@/components/mixer/mixer-view";

export default function MixerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-primary">Interactive Mixer</h1>
        <p className="text-muted-foreground">Your dual-deck virtual DJ booth. Press play on your imagination.</p>
      </div>
      <MixerView />
    </div>
  );
}
