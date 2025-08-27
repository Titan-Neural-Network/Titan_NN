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
  summary: z.string().describe('A brief summary of the document content in plain English.'),
  keyFacts: z.array(z.object({
    fact: z.string().describe('A key fact extracted from the document.'),
    citation: z.string().describe('The citation for where this fact was found (e.g., "Page 1, Section 2").')
  })).describe('An array of key facts from the document.'),
  risksAndFees: z.array(z.object({
    description: z.string().describe('A potential risk, fee, or penalty found in the document.'),
    citation: z.string().describe('The citation for where this risk or fee was found.')
  })).describe('An array of potential risks and fees.'),
  toDoItems: z.array(z.object({
    item: z.string().describe('An actionable to-do item or deadline for the user.'),
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
  prompt: `You are a document intelligence expert specializing in vehicle purchase agreements and legal documents. Analyze the following document and perform these tasks:

1.  **Identify Document Type**: Determine the type of document (e.g., 'Invoice', 'Sales Agreement', 'Loan Document').
2.  **Summarize**: Provide a concise, easy-to-understand summary of the document's main purpose and content in plain English.
3.  **Extract Key Facts**: Identify and list the most important facts. This includes vehicle details (make, model, year, VIN), pricing (total price, down payment, loan amount), dates (purchase date, delivery date), and involved parties.
4.  **Identify Risks & Fees**: Scrutinize the document for any potential risks, hidden fees, penalties (e.g., late payment fees), or clauses that are unfavorable to the buyer.
5.  **Create To-Do Items**: Extract any actionable items, deadlines, or required follow-ups for the user (e.g., 'Submit insurance proof by YYYY-MM-DD', 'Schedule vehicle registration').

For each extracted fact, risk, fee, and to-do item, provide a specific citation pointing to its location in the document (e.g., "Page 3, Section 4.2" or "Loan Terms, Paragraph 2").

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
