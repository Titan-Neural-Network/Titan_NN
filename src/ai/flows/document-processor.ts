'use server';

/**
 * @fileOverview An AI agent for processing and identifying document types from a data URI.
 *
 * - processDocument - A function that handles document processing and identification.
 * - ProcessDocumentInput - The input type for the processDocument function.
 * - ProcessDocumentOutput - The return type for the processDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessDocumentInputSchema = z.object({
  documentDataUri: z.string().describe("A document (image or PDF) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ProcessDocumentInput = z.infer<typeof ProcessDocumentInputSchema>;

const ProcessDocumentOutputSchema = z.object({
  documentType: z.string().describe("The identified type of the document (e.g., 'Invoice', 'Receipt', 'Contract')."),
  summary: z.string().describe('A brief summary of the document content.'),
});
export type ProcessDocumentOutput = z.infer<typeof ProcessDocumentOutputSchema>;

export async function processDocument(
  input: ProcessDocumentInput
): Promise<ProcessDocumentOutput> {
  return processDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processDocumentPrompt',
  input: {schema: ProcessDocumentInputSchema},
  output: {schema: ProcessDocumentOutputSchema},
  prompt: `You are a document intelligence expert. Analyze the following document and identify its type and summarize its content.

Document: {{media url=documentDataUri}}`,
});

const processDocumentFlow = ai.defineFlow(
  {
    name: 'processDocumentFlow',
    inputSchema: ProcessDocumentInputSchema,
    outputSchema: ProcessDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
