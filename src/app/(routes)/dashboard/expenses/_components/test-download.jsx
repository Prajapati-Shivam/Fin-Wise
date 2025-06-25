'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

let PDFDownloadLink = null;

const DynamicExpenseReportDocument = dynamic(
  () =>
    import('./ExpenseReportDocument').then((mod) => mod.ExpenseReportDocument),
  { ssr: false }
);

export default function TestDownload({ expenseList, categoryList, userEmail }) {
  const [PDFLink, setPDFLink] = useState(null);

  useEffect(() => {
    // Only import PDFDownloadLink on client
    import('@react-pdf/renderer').then((mod) => {
      PDFDownloadLink = mod.PDFDownloadLink;
      setPDFLink(() => PDFDownloadLink);
    });
  }, []);

  if (!PDFLink || !expenseList || !categoryList || !userEmail) return null;

  return (
    <PDFLink
      document={
        <DynamicExpenseReportDocument
          expenseList={expenseList}
          categoryList={categoryList}
          userEmail={userEmail}
        />
      }
      fileName={`${new Date().toLocaleString('default', {
        month: 'long',
      })}-Expense-Report.pdf`}
    >
      {({ loading }) => (loading ? 'Loading PDF...' : 'Download Report')}
    </PDFLink>
  );
}
