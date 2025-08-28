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
  summary: z.string().describe('A brief, one-sentence summary of the document content in plain English.'),
  keyFacts: z.array(z.object({
    fact: z.string().describe('A key fact extracted from the document, stated as concisely as possible.'),
    citation: z.string().describe('The citation for where this fact was found (e.g., "Page 1, Section 2").')
  })).describe('An array of key facts from the document.'),
  risksAndFees: z.array(z.object({
    description: z.string().describe('A potential risk, fee, or penalty found in the document, stated as concisely as possible.'),
    citation: z.string().describe('The citation for where this risk or fee was found.')
  })).describe('An array of potential risks and fees.'),
  toDoItems: z.array(z.object({
    item: z.string().describe('An actionable to-do item or deadline for the user, stated as concisely as possible.'),
    citation: z.string().describe('The citation for where this to-do item was found.')
  })).describe('An array of to-do items for the user.'),
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
  prompt: `You are a document intelligence expert. Your goal is to analyze documents and provide very concise, short, and to-the-point information. Be as brief as possible in all your responses.

First, identify the document's language. If it is not in English, translate the key terms into English for your analysis. Interpret both typed and handwritten text.

1.  **Identify Document Type**: Briefly state the document type (e.g., 'Sales Agreement', 'Loan Contract').
2.  **Summarize**: Provide a single, short sentence summarizing the document's purpose.
3.  **Extract Key Facts**: List only the most critical facts (e.g., vehicle, price, interest rate, parties). Keep the description of each fact extremely brief.
4.  **Identify Risks & Fees**: List potential risks or fees. Be very concise.
5.  **Create To-Do Items**: List any action items or deadlines. Be very concise.

For every extracted item, provide a specific citation (e.g., "Page 3, Section 4.2").

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
