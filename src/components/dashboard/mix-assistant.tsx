'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getAIAssistedMixingAdvice,
  type AIAssistedMixingOutput,
} from '@/ai/flows/ai-assisted-mixing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import { Loader2, Sparkles, Mic2 } from 'lucide-react';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  currentTrack: z.string().min(1, 'Current track is required.'),
  nextTrack: z.string().min(1, 'Next track is required.'),
  djExperience: z.enum(['beginner', 'intermediate', 'expert']),
  userPreferences: z.string().optional(),
});

export function MixAssistant() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [advice, setAdvice] = React.useState<AIAssistedMixingOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentTrack: '',
      nextTrack: '',
      djExperience: 'beginner',
      userPreferences: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAdvice(null);
    try {
      const result = await getAIAssistedMixingAdvice(values);
      setAdvice(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error getting advice',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-accent/20 shadow-lg shadow-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <span>AI DJ Mix Assistant</span>
        </CardTitle>
        <CardDescription>Get intelligent transition advice and optimal drop points.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="currentTrack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Track</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Daft Punk - Around the World'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextTrack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Track</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Justice - D.A.N.C.E.'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="djExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DJ Experience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mixing Preferences (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., 'Smooth long blend' or 'Quick cut'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get Mixing Advice'
              )}
            </Button>
          </form>
        </Form>
        {advice && (
          <div className="mt-6 space-y-4">
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Transition Advice</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap font-code">{advice.transitionAdvice}</p>
            </div>
             <div className="space-y-2">
              <h3 className="font-semibold text-accent">Optimal Drop Points</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap font-code">{advice.optimalDropPoints}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
