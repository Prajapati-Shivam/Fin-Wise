const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// const apikey = 123;
/**
 * Generates financial advice based on various expense metrics.
 * @param {{
 *   totalSpend: number;
 *   averageDailySpend: number;
 *   highestExpense: number;
 *   expenseCount: number;
 * }} data
 * @returns {Promise<string>}
 */
export default async function getFinancialAdvice({
  totalSpend,
  averageDailySpend,
  highestExpense,
  expenseCount,
}) {
  try {
    const prompt = `A user has recorded the following spending stats:
- Total Spend: ₹${totalSpend.toFixed(2)}
- Average Daily Spend: ₹${averageDailySpend.toFixed(2)}
- Highest Single Expense: ₹${highestExpense.toFixed(2)}
- Total Number of Expenses: ${expenseCount}

Based on this data, give 2–3 concise and practical financial advice points to help them manage spending better. Keep it actionable and easy to understand.(Within 70-80 words)`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    const advice = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return advice;
  } catch (error) {
    console.error('❌ Error fetching financial advice:', error.message);
    return 'Sorry, we could not fetch financial advice at the moment.';
  }
}
