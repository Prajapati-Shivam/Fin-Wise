import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderToBuffer } from '@react-pdf/renderer';
import { ExpenseReportDocument } from '@/app/(routes)/dashboard/expenses/_components/ExpenseReportDocument';
import {
  getAllOptedInUsers,
  getExpensesForUser,
  getCategoriesForUser,
} from '@/db/queries';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendExpenseReport({ email, expenseList, categoryList }) {
  // Render PDF to a Buffer on the server
  const pdfBuffer = await renderToBuffer(
    React.createElement(ExpenseReportDocument, {
      expenseList,
      categoryList,
      userEmail: email,
    })
  );

  const fileName = `${new Date().toLocaleString('default', { month: 'long' })}-Expense-Report.pdf`;
  const unsubscribeUrl = 'https://fin-wise-web.vercel.app/dashboard/expenses';

  return await resend.emails.send({
    from: 'FinWise <onboarding@resend.dev>',
    to: email,
    subject: 'Your Monthly Expense Report',
    text: [
      'Hello,',
      '',
      'Attached is your monthly expense report in PDF format.',
      '',
      'Don’t need to receive reports anymore?',
      `Unsubscribe here: ${unsubscribeUrl}`,
    ].join('\n'),
    attachments: [
      {
        filename: fileName,
        content: pdfBuffer,
      },
    ],
  });
}

// GET — triggered by Vercel cron job
export async function GET() {
  try {
    // const today = new Date();
    // if (today.getDate() !== 1) {
    //   return NextResponse.json({ message: 'Not the first day of the month — skipping.' });
    // }

    const users = await getAllOptedInUsers(); // from DB
    const results = [];

    for (const user of users) {
      const expenseList = await getExpensesForUser(user.id);
      const categoryList = await getCategoriesForUser(user.id);

      const res = await sendExpenseReport({
        email: user.email,
        expenseList,
        categoryList,
      });
      results.push({ email: user.email, status: res });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: 'Failed to send reports.' },
      { status: 500 }
    );
  }
}
