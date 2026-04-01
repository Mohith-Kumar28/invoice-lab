import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Invoice } from '@/types/invoice.types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  invoiceInfo: {
    textAlign: 'right',
  },
  label: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    marginBottom: 8,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  addressBox: {
    width: '45%',
  },
  businessName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.4,
  },
  table: {
    width: '100%',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1a365d',
    paddingBottom: 5,
    marginBottom: 10,
  },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'right' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  th: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  tr: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 5,
    paddingTop: 5,
  },
  td: {
    fontSize: 10,
    color: '#333333',
  },
  totals: {
    width: '40%',
    alignSelf: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: '#666666',
  },
  totalValue: {
    fontSize: 10,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#1a365d',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  }
});

export const ClassicTemplate = ({ invoice }: { invoice: Partial<Invoice> }) => {
  const themeColor = invoice.colorTheme || '#1a365d';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: themeColor }]}>{invoice.title || 'INVOICE'}</Text>
            <Text style={styles.value}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.label}>Issue Date</Text>
            <Text style={styles.value}>{invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : ''}</Text>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.value}>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : ''}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.addressBox}>
            <Text style={styles.label}>From:</Text>
            <Text style={styles.businessName}>{invoice.from?.businessName}</Text>
            <Text style={styles.addressText}>{invoice.from?.email}</Text>
            <Text style={styles.addressText}>{invoice.from?.address?.line1}</Text>
            <Text style={styles.addressText}>{invoice.from?.address?.city}{invoice.from?.address?.city && invoice.from?.address?.country ? ', ' : ''}{invoice.from?.address?.country}</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.label}>Bill To:</Text>
            <Text style={styles.businessName}>{invoice.to?.businessName}</Text>
            <Text style={styles.addressText}>{invoice.to?.email}</Text>
            <Text style={styles.addressText}>{invoice.to?.address?.line1}</Text>
            <Text style={styles.addressText}>{invoice.to?.address?.city}{invoice.to?.address?.city && invoice.to?.address?.country ? ', ' : ''}{invoice.to?.address?.country}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableHeader, { borderBottomColor: themeColor }]}>
            <Text style={[styles.col1, styles.th, { color: themeColor }]}>Description</Text>
            <Text style={[styles.col2, styles.th, { color: themeColor }]}>Qty</Text>
            <Text style={[styles.col3, styles.th, { color: themeColor }]}>Price</Text>
            <Text style={[styles.col4, styles.th, { color: themeColor }]}>Amount</Text>
          </View>
          {invoice.lineItems?.map((item, i) => (
            <View key={i} style={styles.tr}>
              <Text style={[styles.col1, styles.td]}>{item.description}</Text>
              <Text style={[styles.col2, styles.td]}>{item.quantity}</Text>
              <Text style={[styles.col3, styles.td]}>{item.unitPrice}</Text>
              <Text style={[styles.col4, styles.td]}>{item.amount?.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{invoice.currency} {invoice.subtotal?.toFixed(2)}</Text>
          </View>
          {!!invoice.discountAmount && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalValue}>-{invoice.currency} {invoice.discountAmount?.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.grandTotalRow, { borderTopColor: themeColor }]}>
            <Text style={[styles.grandTotalLabel, { color: themeColor }]}>Total</Text>
            <Text style={styles.grandTotalValue}>{invoice.currency} {invoice.total?.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};
