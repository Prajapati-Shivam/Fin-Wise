import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function blobToBuffer(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      if (
        req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
      ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const formData = await req.formData();
    const pdfBlob = formData.get('pdf');
    const email = formData.get('email');

    if (!pdfBlob || !(pdfBlob instanceof Blob) || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. Missing PDF or email.' },
        { status: 400 }
      );
    }

    const pdfBuffer = await blobToBuffer(pdfBlob);
    const fileName = `${new Date().toLocaleString('default', {
      month: 'long',
    })}-Expense-Report.pdf`;

    const unsubscribeUrl = 'https://fin-wise-web.vercel.app/dashboard/expenses';

    const response = await resend.emails.send({
      from: 'FinWise <onboarding@resend.dev>', // Replace with your verified sender
      to: email,
      subject: 'Your Monthly Expense Report',
      text: [
        'Hello,',
        '',
        'Attached is your monthly expense report in PDF format.',
        '',
        "Don't need to receive reports anymore?",
        `Unsubscribe here: ${unsubscribeUrl}`,
      ].join('\n'),
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email.' },
      { status: 500 }
    );
  }
}

// GET handler for quick testing (mock data)
export async function GET() {
  // Mock run — no PDF, just returns success
  return NextResponse.json({
    message: 'Cron job test successful — POST endpoint is ready.',
  });
}
