import { PlaylistGenerator } from "@/components/dashboard/playlist-generator";
import { MixAssistant } from "@/components/dashboard/mix-assistant";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-primary">Dashboard</h1>
        <p className="text-muted-foreground">Your AI-powered music command center.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <PlaylistGenerator />
        <MixAssistant />
      </div>
    </div>
  );
}
