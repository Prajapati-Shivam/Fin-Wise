'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styling
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  sectionTitle: { fontSize: 14, marginVertical: 10, fontWeight: 'bold' },
  table: { display: 'table', width: 'auto', marginBottom: 10 },
  tableRow: { flexDirection: 'row' },
  tableCell: { flex: 1, padding: 5, border: '1 solid #ccc' },
  bold: { fontWeight: 'bold' },
});

export function ExpenseReportDocument({
  expenseList = [],
  categoryList = [],
  userEmail = '',
}) {
  // Sort by date ascending
  const sortedExpenses = [...expenseList].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Total expenses
  const total = sortedExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // Get category name
  const getCategoryName = (categoryId) => {
    const cat = categoryList.find((c) => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  };

  // Calculate per-category totals
  const categoryTotals = categoryList
    .map((cat) => {
      const catExpenses = sortedExpenses.filter((e) => e.categoryId === cat.id);
      const catTotal = catExpenses.reduce(
        (sum, e) => sum + Number(e.amount),
        0
      );
      return {
        ...cat,
        total: catTotal,
        percent: total > 0 ? ((catTotal / total) * 100).toFixed(1) : '0.0',
      };
    })
    .filter((c) => c.total > 0); // Only show categories with expenses

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>
          FinWise: {new Date().toLocaleDateString('en-US', { month: 'long' })}{' '}
          Expense Report
        </Text>
        <Text>Email: {userEmail}</Text>
        <Text style={{ marginVertical: 5 }}>
          Total Expenses: {total.toLocaleString()}
        </Text>

        {/* Category Totals Summary */}
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.bold]}>
            <Text style={styles.tableCell}>Category</Text>
            <Text style={styles.tableCell}>Total</Text>
            <Text style={styles.tableCell}>% of Total</Text>
          </View>
          {categoryTotals.map((cat) => (
            <View key={cat.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{cat.name}</Text>
              <Text style={styles.tableCell}>{cat.total.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{cat.percent}%</Text>
            </View>
          ))}
        </View>

        {/* Detailed Expense List */}
        <Text style={styles.sectionTitle}>Detailed Expense List</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.bold]}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Category</Text>
            <Text style={styles.tableCell}>Name</Text>
            <Text style={styles.tableCell}>Amount</Text>
          </View>
          {sortedExpenses.map((e) => (
            <View style={styles.tableRow} key={e.id}>
              <Text style={styles.tableCell}>
                {new Date(e.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.tableCell}>
                {getCategoryName(e.categoryId)}
              </Text>
              <Text style={styles.tableCell}>{e.name}</Text>
              <Text style={styles.tableCell}>
                {Number(e.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
