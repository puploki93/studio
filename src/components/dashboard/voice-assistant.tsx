'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  voiceDJAssistant,
  type VoiceDJAssistantOutput,
} from '@/ai/flows/voice-dj-assistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, Send, Loader2, Volume2, Lightbulb, AlertTriangle, BookOpen } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  query: z.string().min(3, 'Ask me anything about DJing!'),
});

export function VoiceAssistant() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [response, setResponse] = React.useState<VoiceDJAssistantOutput | null>(null);
  const [conversationHistory, setConversationHistory] = React.useState<
    Array<{ query: string; response: VoiceDJAssistantOutput }>
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await voiceDJAssistant({
        query: values.query,
        currentContext: {
          // You can populate this with actual DJ context in a real implementation
          currentTrack: undefined,
          deckAPlaying: false,
          deckBPlaying: false,
        },
      });
      setResponse(result);
      setConversationHistory((prev) => [...prev, { query: values.query, response: result }]);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get response. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'information':
        return <Volume2 className="h-4 w-4" />;
      case 'suggestion':
        return <Lightbulb className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'tutorial':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Mic className="h-4 w-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'information':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'suggestion':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'tutorial':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'command':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className="border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-6 w-6 text-primary" />
          <span>AI Voice DJ Assistant</span>
        </CardTitle>
        <CardDescription>
          Ask me anything - mixing advice, track suggestions, DJ techniques, or commands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question or Command</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., 'What should I play next?' or 'How do I do a bass swap?'"
                        {...field}
                      />
                      <Button type="submit" disabled={isLoading} size="icon">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        {/* Example queries */}
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "What's the best way to transition from techno to house?",
              'How do I harmonic mix?',
              'Recommend tracks at 128 BPM',
              'Teach me the bass swap technique',
            ].map((example, idx) => (
              <button
                key={idx}
                onClick={() => form.setValue('query', example)}
                className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {response && (
          <div className="mt-6 space-y-4">
            <Separator />

            {/* Action Type Badge */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${getActionColor(response.actionType)} flex items-center gap-1`}
              >
                {getActionIcon(response.actionType)}
                <span className="capitalize">{response.actionType.replace('_', ' ')}</span>
              </Badge>
              <Badge variant="outline">
                {response.confidence}% confident
              </Badge>
            </div>

            {/* Response */}
            <div className="space-y-2">
              <h3 className="font-semibold text-accent flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Response
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap pl-4">
                {response.response}
              </p>
            </div>

            {/* Suggested Actions */}
            {response.suggestedActions && response.suggestedActions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Suggested Actions
                </h4>
                <ul className="space-y-1 pl-4">
                  {response.suggestedActions.map((action, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Command Parameters */}
            {response.commandParameters && Object.keys(response.commandParameters).length > 0 && (
              <div className="space-y-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
                <h4 className="text-sm font-semibold text-accent">Parsed Command</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(response.commandParameters).map(
                    ([key, value]) =>
                      value && (
                        <div key={key}>
                          <span className="text-muted-foreground capitalize">{key}: </span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="mt-6">
            <Separator className="mb-4" />
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Recent Conversation</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {conversationHistory.slice(-3).reverse().map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted/30 space-y-2">
                  <p className="text-xs font-semibold text-primary">You: {item.query}</p>
                  <p className="text-xs text-muted-foreground">{item.response.response.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
