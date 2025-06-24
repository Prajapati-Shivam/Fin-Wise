// test-download.tsx
'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { ExpenseReportDocument } from './ExpenseReportDocument';

export default function TestDownload({ expenseList, categoryList, userEmail }) {
  return (
    <PDFDownloadLink
      document={
        <ExpenseReportDocument
          expenseList={expenseList}
          categoryList={categoryList}
          userEmail={userEmail}
        />
      }
      // set file name dynamically monthname-expense-report.pdf
      fileName={`${new Date().toLocaleString('default', {
        month: 'long',
      })}-Expense-Report.pdf`}
    >
      {({ loading }) => (loading ? 'Loading PDF...' : 'Download Report')}
    </PDFDownloadLink>
  );
}
