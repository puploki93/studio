'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateTransition,
  type GenerateTransitionOutput,
} from '@/ai/flows/generate-transitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Zap, Loader2, Clock, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  fromTrack: z.string().min(1, 'From track is required'),
  toTrack: z.string().min(1, 'To track is required'),
  fromBpm: z.string().optional(),
  toBpm: z.string().optional(),
  fromKey: z.string().optional(),
  toKey: z.string().optional(),
  transitionStyle: z.enum(['smooth', 'energetic', 'dramatic', 'creative', 'minimal']),
  transitionLength: z.enum(['quick', 'medium', 'long', 'extended']),
});

export function TransitionGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [transition, setTransition] = React.useState<GenerateTransitionOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromTrack: '',
      toTrack: '',
      fromBpm: '',
      toBpm: '',
      fromKey: '',
      toKey: '',
      transitionStyle: 'smooth',
      transitionLength: 'medium',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTransition(null);
    try {
      const result = await generateTransition({
        fromTrack: values.fromTrack,
        toTrack: values.toTrack,
        fromBpm: values.fromBpm ? parseFloat(values.fromBpm) : undefined,
        toBpm: values.toBpm ? parseFloat(values.toBpm) : undefined,
        fromKey: values.fromKey || undefined,
        toKey: values.toKey || undefined,
        transitionStyle: values.transitionStyle,
        transitionLength: values.transitionLength,
        availableEffects: ['Reverb', 'Delay', 'Filter', 'Echo', 'Flanger'],
      });
      setTransition(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate transition. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'expert':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getDeckColor = (deck: string) => {
    switch (deck) {
      case 'A':
        return 'bg-blue-500/10 text-blue-500';
      case 'B':
        return 'bg-purple-500/10 text-purple-500';
      case 'both':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <Card className="border-accent/20 shadow-lg shadow-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-accent" />
          <span>AI Transition Generator</span>
        </CardTitle>
        <CardDescription>
          Generate creative, step-by-step transitions between any two tracks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Track Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromTrack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Track</FormLabel>
                    <FormControl>
                      <Input placeholder="Artist - Track Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toTrack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Track</FormLabel>
                    <FormControl>
                      <Input placeholder="Artist - Track Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* BPM and Key */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="fromBpm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">From BPM</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fromKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">From Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Am" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toBpm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">To BPM</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="128" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">To Key</FormLabel>
                    <FormControl>
                      <Input placeholder="C" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Style and Length */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="transitionStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="smooth">Smooth - Seamless blend</SelectItem>
                        <SelectItem value="energetic">Energetic - High impact</SelectItem>
                        <SelectItem value="dramatic">Dramatic - Big moments</SelectItem>
                        <SelectItem value="creative">Creative - Experimental</SelectItem>
                        <SelectItem value="minimal">Minimal - Clean & precise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transitionLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="quick">Quick (8-16 bars)</SelectItem>
                        <SelectItem value="medium">Medium (16-32 bars)</SelectItem>
                        <SelectItem value="long">Long (32-64 bars)</SelectItem>
                        <SelectItem value="extended">Extended (64+ bars)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Transition...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Transition
                </>
              )}
            </Button>
          </form>
        </Form>

        {transition && (
          <div className="mt-6 space-y-4">
            <Separator />

            {/* Transition Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-accent">{transition.transitionName}</h3>
                <Badge variant="outline" className={getDifficultyColor(transition.difficulty)}>
                  {transition.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{transition.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Duration: {transition.totalDuration}</span>
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Target className="h-4 w-4" />
                Step-by-Step Timeline
              </h4>
              <div className="space-y-3 pl-4 border-l-2 border-accent/20">
                {transition.steps.map((step, idx) => (
                  <div key={idx} className="relative pl-4">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-[8px] font-bold text-accent-foreground">{idx + 1}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {step.timepoint}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getDeckColor(step.deck)}`}>
                          Deck {step.deck}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{step.action}</p>
                      {/* Parameters */}
                      {Object.keys(step.parameters).length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                          {step.parameters.volume !== undefined && (
                            <span>Vol: {step.parameters.volume}%</span>
                          )}
                          {step.parameters.crossfader !== undefined && (
                            <span>X-Fader: {step.parameters.crossfader}</span>
                          )}
                          {step.parameters.effect && (
                            <span>FX: {step.parameters.effect}</span>
                          )}
                          {step.parameters.eq && (
                            <span>
                              EQ: L:{step.parameters.eq.low} M:{step.parameters.eq.mid} H:{step.parameters.eq.high}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Moments */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-accent flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Key Moments
              </h4>
              <ul className="space-y-1 pl-4">
                {transition.keyMoments.map((moment, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent">★</span>
                    <span>{moment}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Tips */}
            <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Pro Tips
              </h4>
              <ul className="space-y-1">
                {transition.tips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Cue */}
            {transition.visualCue && (
              <div className="text-xs text-muted-foreground p-2 rounded bg-muted/30">
                <span className="font-semibold">Visual Cue: </span>
                {transition.visualCue}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
