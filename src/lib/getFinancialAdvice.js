const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// const apikey = 123;

function buildFallbackAdvice({
  totalSpend,
  averageDailySpend,
  highestExpense,
  expenseCount,
}) {
  const total = Number(totalSpend || 0);
  const average = Number(averageDailySpend || 0);
  const highest = Number(highestExpense || 0);
  const count = Number(expenseCount || 0);

  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  });

  return [
    'I could not reach Gemini right now, so here is a quick fallback based on your spending:',
    '',
    `- Your total spend is ₹${formatter.format(total)}. Set a small weekly cap so the next few days stay predictable.`,
    `- Your average daily spend is ₹${formatter.format(average)}. Try trimming it by 10% this week and track whether that sticks.`,
    `- Your highest expense was ₹${formatter.format(highest)} across ${count} entries. Review that category first for easy reductions.`,
  ].join('\n');
}
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
  const fallbackAdvice = buildFallbackAdvice({
    totalSpend,
    averageDailySpend,
    highestExpense,
    expenseCount,
  });

  if (!apiKey) {
    return fallbackAdvice;
  }

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
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return fallbackAdvice;
      }

      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    const advice = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return advice || fallbackAdvice;
  } catch (error) {
    return fallbackAdvice;
  }
}
