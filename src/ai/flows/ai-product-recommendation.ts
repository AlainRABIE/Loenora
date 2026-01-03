'use server';

/**
 * @fileOverview AI-powered product recommendation flow.
 *
 * This file defines a Genkit flow that recommends products to users based on their browsing history and purchase behavior.
 *
 * @exported
 * - `recommendProducts`:  The function to call to get product recommendations.
 * - `AIProductRecommendationInput`: The input type for the `recommendProducts` function.
 * - `AIProductRecommendationOutput`: The output type for the `recommendProducts` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIProductRecommendationInputSchema = z.object({
  user_id: z.string().describe('The ID of the user for whom to generate recommendations.'),
  browsing_history: z
    .array(z.string())
    .describe('An array of product IDs representing the user\'s browsing history.'),
  purchase_history: z
    .array(z.string())
    .describe('An array of product IDs representing the user\'s purchase history.'),
  product_catalog: z.string().describe('The product catalog in JSON format.'),
});

export type AIProductRecommendationInput = z.infer<typeof AIProductRecommendationInputSchema>;

const AIProductRecommendationOutputSchema = z.object({
  recommended_products: z.array(z.string()).describe('An array of product IDs that are recommended for the user.'),
  reasoning: z.string().describe('The reasoning behind the product recommendations.'),
});

export type AIProductRecommendationOutput = z.infer<typeof AIProductRecommendationOutputSchema>;

async function getProductRecommendations(input: AIProductRecommendationInput): Promise<AIProductRecommendationOutput> {
  return aiProductRecommendationFlow(input);
}

export {getProductRecommendations as recommendProducts};

const productRecommendationPrompt = ai.definePrompt({
  name: 'productRecommendationPrompt',
  input: {schema: AIProductRecommendationInputSchema},
  output: {schema: AIProductRecommendationOutputSchema},
  prompt: `You are an expert e-commerce product recommendation engine. Given a user's browsing history, purchase history, and a product catalog, you will recommend products that the user might be interested in.

Product Catalog:
{{{product_catalog}}}

Browsing History: {{#each browsing_history}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Purchase History: {{#each purchase_history}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Based on this information, recommend products to the user.  Explain your reasoning for each recommendation.

Ensure that the products recommended are present in the product catalog. The recommended_products field should be a list of product IDs from the product catalog.

Consider the user's past purchases and browsing history to tailor the recommendations. For example, if a user has purchased a camera, recommend camera accessories.

Format your response as a JSON object with 'recommended_products' (an array of product IDs) and 'reasoning' (a string explaining the recommendations) fields.`,
});

const aiProductRecommendationFlow = ai.defineFlow(
  {
    name: 'aiProductRecommendationFlow',
    inputSchema: AIProductRecommendationInputSchema,
    outputSchema: AIProductRecommendationOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationPrompt(input);
    return output!;
  }
);
