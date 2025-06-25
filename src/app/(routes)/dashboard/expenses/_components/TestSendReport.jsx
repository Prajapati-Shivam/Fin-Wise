'use client';
import { pdf } from '@react-pdf/renderer';
import { ExpenseReportDocument } from './ExpenseReportDocument';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const TestSendReport = ({ userEmail, expenseList, categoryList }) => {
  const handleTestSend = async () => {
    if (!userEmail) {
      toast.error('No email found!');
      return;
    }

    try {
      // Generate PDF blob
      const blob = await pdf(
        <ExpenseReportDocument
          expenseList={expenseList}
          categoryList={categoryList}
          userEmail={userEmail}
        />
      ).toBlob();

      if (!blob) {
        toast.error('Failed to generate PDF.');
        return;
      }

      // Build FormData
      const formData = new FormData();
      formData.append(
        'pdf',
        new File([blob], 'ExpenseReport.pdf', { type: 'application/pdf' })
      );
      formData.append('email', userEmail);

      // Call the API
      const res = await fetch('/api/send-expense-report', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast.success('Report sent successfully!');
      } else {
        const err = await res.text();
        console.error('Error sending report:', err);
        toast.error(`Failed: ${err}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Button variant='secondary' onClick={handleTestSend}>
      Test Send Report
    </Button>
  );
};

export default TestSendReport;
