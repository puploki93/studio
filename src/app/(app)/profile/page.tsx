import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src="https://picsum.photos/seed/avatar/200/200" alt="@user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h1 className="text-2xl font-bold">DJ Glitcher</h1>
              <p className="text-muted-foreground">user@example.com</p>
            </div>
            <Button>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-accent">My Shared Playlists</h2>
        <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <CardTitle>Playlist Title {i+1}</CardTitle>
                        <CardDescription>A brief description of this awesome playlist.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">10 Songs | 45 min</p>
                    </CardContent>
                </Card>
            ))}
        </div>
         <div className="flex justify-center mt-6">
            <Button variant="outline">View All Playlists</Button>
        </div>
      </div>
    </div>
  );
}
