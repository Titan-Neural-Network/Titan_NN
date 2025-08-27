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
  prompt: `You are a document intelligence expert specializing in vehicle purchase agreements and related legal documents from around the world. Your primary goal is to help users understand these complex documents, which may contain a mix of typed and handwritten text, regardless of the original language. Analyze the following document and perform these tasks:

First, identify the primary language of the document. If it is not in English, translate the key sections and important terms into English to facilitate your analysis. The document may contain both typed and handwritten text. Do your best to interpret the handwritten portions.

1.  **Identify Document Type**: Determine the specific type of document (e.g., 'Vehicle Sales Agreement', 'Auto Loan Contract', 'Bill of Sale', 'Lease Agreement').
2.  **Summarize**: Provide a concise, easy-to-understand summary of the document's main purpose and content in plain English. Start by stating what the document is for.
3.  **Extract Key Facts**: Identify and list the most important facts from both typed and handwritten sections. This includes crucial details like vehicle information (make, model, year, VIN), pricing breakdowns (total price, down payment, trade-in value, loan amount), interest rates, loan terms, and all involved parties (buyer, seller, lender).
4.  **Identify Risks & Fees**: Scrutinize the document for any potential risks, hidden fees, or penalties. This includes things like prepayment penalties, late payment fees, high interest rates, unfavorable warranty clauses, or any terms that seem disadvantageous to the buyer.
5.  **Create To-Do Items**: Extract any actionable items, deadlines, or required follow-ups for the user. For example: 'Submit proof of insurance by YYYY-MM-DD', 'Make first payment by YYYY-MM-DD', 'Complete vehicle registration at the DMV'.

For every extracted fact, risk, fee, and to-do item, you must provide a specific citation pointing to its location in the document (e.g., "Page 3, Section 4.2" or "Loan Terms, Paragraph 2"). If the document is illegible or you cannot confidently translate and analyze it, state that you cannot process it and explain why.

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
