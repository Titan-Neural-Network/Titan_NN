'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Scale, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { extractSummarizeLegalClauses, type ExtractSummarizeLegalClausesOutput } from '@/ai/flows/legalese-distiller';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ExtractSummarizeLegalClausesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: 'https://policies.google.com/terms',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setSummary(null);
    try {
      const result = await extractSummarizeLegalClauses({ url: values.url });
      setSummary(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to distill the legalese. Please check the URL and try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full w-full flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <Scale className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            LegalEagle
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Paste a URL to a legal document, and we&apos;ll distill the key points, obligations, and rights into a simple summary.
          </p>
        </div>

        <div className="mx-auto max-w-2xl mt-10">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Document URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/terms" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full font-bold" size="lg" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Distilling...' : 'Distill Legalese'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto max-w-2xl mt-10">
          {loading && (
            <Card className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-8 w-2/5 rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
              </CardContent>
            </Card>
          )}

          {summary && (
            <Card className="shadow-lg animate-in fade-in-50">
              <CardHeader>
                <CardTitle className="text-2xl">Summary</CardTitle>
                <CardDescription>Here are the key points from the document.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {summary.summary}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Powered by LegalEagle. Understand what you agree to.</p>
      </footer>
    </div>
  );
}
