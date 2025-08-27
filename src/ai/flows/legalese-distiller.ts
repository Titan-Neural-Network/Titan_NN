'use server';

/**
 * @fileOverview An AI agent for extracting and summarizing legal clauses from a given URL.
 *
 * - extractSummarizeLegalClauses - A function that handles the extraction and summarization of legal clauses.
 * - ExtractSummarizeLegalClausesInput - The input type for the extractSummarizeLegalClauses function.
 * - ExtractSummarizeLegalClausesOutput - The return type for the extractSummarizeLegalClauses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSummarizeLegalClausesInputSchema = z.object({
  url: z.string().url().describe('The URL containing the legal text to extract and summarize.'),
});
export type ExtractSummarizeLegalClausesInput = z.infer<typeof ExtractSummarizeLegalClausesInputSchema>;

const ExtractSummarizeLegalClausesOutputSchema = z.object({
  summary: z.string().describe('A summary of the key legal clauses, obligations, and rights extracted from the URL.'),
});
export type ExtractSummarizeLegalClausesOutput = z.infer<typeof ExtractSummarizeLegalClausesOutputSchema>;

export async function extractSummarizeLegalClauses(
  input: ExtractSummarizeLegalClausesInput
): Promise<ExtractSummarizeLegalClausesOutput> {
  return extractSummarizeLegalClausesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSummarizeLegalClausesPrompt',
  input: {schema: ExtractSummarizeLegalClausesInputSchema},
  output: {schema: ExtractSummarizeLegalClausesOutputSchema},
  prompt: `You are an expert legal analyst. Your task is to extract and summarize the key legal clauses, obligations, and rights from the text found at the following URL: {{{url}}}. Focus on providing a clear and concise summary that highlights the most important aspects of the legal document for an average person to understand.`,
});

const extractSummarizeLegalClausesFlow = ai.defineFlow(
  {
    name: 'extractSummarizeLegalClausesFlow',
    inputSchema: ExtractSummarizeLegalClausesInputSchema,
    outputSchema: ExtractSummarizeLegalClausesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
