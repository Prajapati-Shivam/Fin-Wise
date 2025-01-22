const { OpenAI } = require('openai');

const api = new OpenAI({
  baseURL: 'https://api.aimlapi.com',
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Generates financial advice using the Gemini AI API.
 * @param {number} totalBudget - The user's total budget.
 * @param {number} totalIncome - The user's total income.
 * @param {number} totalSpend - The user's total spending.
 * @returns {Promise<string>} - A promise resolving to the financial advice string.
 */
export default async function getFinancialAdvice(
  totalBudget,
  totalIncome,
  totalSpend
) {
  // try {
  //   const result = await api.chat.completions.create({
  //     model: 'google/gemma-2-27b-it',
  //     messages: [
  //       {
  //         role: 'system',
  //         content: 'You are an AI financial advisor.',
  //       },
  //       {
  //         role: 'user',
  //         content: `Based on the following financial data: Total Budget:${totalBudget}INR, Total Income:${totalIncome}INR, Total Spending:${totalSpend}INR. Provide concise financial advice in 2-3 sentences to help the user manage their finances effectively.`,
  //       },
  //     ],
  //     temperature: 0.7,
  //     max_tokens: 256,
  //   });

  //   // Extract the advice from the API response
  //   const message = result.choices[0].message.content;
  //   console.log(`Assistant: ${message}`);
  //   return message;
  // } catch (error) {
  //   console.error('Error fetching financial advice:', error.message);
  //   return 'Sorry, we could not fetch financial advice at this moment. Please try again later.';
  // }
  return 'Sample advice';
}
