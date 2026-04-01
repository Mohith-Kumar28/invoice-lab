import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Invoice } from '@/types/invoice.types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  headerBand: {
    backgroundColor: '#1a365d',
    padding: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  invoiceInfo: {
    textAlign: 'right',
  },
  labelWhite: {
    fontSize: 10,
    color: '#A0AEC0',
    marginBottom: 2,
  },
  valueWhite: {
    fontSize: 12,
    marginBottom: 8,
  },
  content: {
    padding: 40,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  addressBox: {
    width: '45%',
  },
  label: {
    fontSize: 10,
    color: '#A0AEC0',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2D3748',
  },
  addressText: {
    fontSize: 10,
    color: '#4A5568',
    lineHeight: 1.5,
  },
  table: {
    width: '100%',
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
    marginBottom: 12,
  },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'right' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  th: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4A5568',
    textTransform: 'uppercase',
  },
  tr: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  td: {
    fontSize: 11,
    color: '#2D3748',
  },
  totals: {
    width: '40%',
    alignSelf: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 11,
    color: '#718096',
  },
  totalValue: {
    fontSize: 11,
    color: '#2D3748',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#E2E8F0',
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#F7FAFC',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#718096',
  }
});

export const ModernTemplate = ({ invoice }: { invoice: Partial<Invoice> }) => {
  const themeColor = invoice.colorTheme || '#1a365d';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.headerBand, { backgroundColor: themeColor }]}>
          <View>
            <Text style={styles.title}>{invoice.title || 'INVOICE'}</Text>
            <Text style={styles.valueWhite}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.labelWhite}>Issue Date</Text>
            <Text style={styles.valueWhite}>{invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : ''}</Text>
            <Text style={styles.labelWhite}>Due Date</Text>
            <Text style={styles.valueWhite}>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : ''}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.addressBox}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.businessName}>{invoice.from?.businessName}</Text>
              <Text style={styles.addressText}>{invoice.from?.email}</Text>
              <Text style={styles.addressText}>{invoice.from?.address?.line1}</Text>
              <Text style={styles.addressText}>{invoice.from?.address?.city}{invoice.from?.address?.city && invoice.from?.address?.country ? ', ' : ''}{invoice.from?.address?.country}</Text>
            </View>
            <View style={styles.addressBox}>
              <Text style={styles.label}>Bill To</Text>
              <Text style={styles.businessName}>{invoice.to?.businessName}</Text>
              <Text style={styles.addressText}>{invoice.to?.email}</Text>
              <Text style={styles.addressText}>{invoice.to?.address?.line1}</Text>
              <Text style={styles.addressText}>{invoice.to?.address?.city}{invoice.to?.address?.city && invoice.to?.address?.country ? ', ' : ''}{invoice.to?.address?.country}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.col1, styles.th]}>Description</Text>
              <Text style={[styles.col2, styles.th]}>Qty</Text>
              <Text style={[styles.col3, styles.th]}>Price</Text>
              <Text style={[styles.col4, styles.th]}>Amount</Text>
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
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={[styles.grandTotalValue, { color: themeColor }]}>{invoice.currency} {invoice.total?.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your business.</Text>
          <Text style={styles.footerText}>{invoice.from?.website}</Text>
        </View>
      </Page>
    </Document>
  );
};
