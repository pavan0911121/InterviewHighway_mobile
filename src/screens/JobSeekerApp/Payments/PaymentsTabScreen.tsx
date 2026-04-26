import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, Animated, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../Redux'
import * as AsyncStore from "../../../AsyncStore";
import { getPaymentHistoryData } from '../../../Redux/slices/paymentsSlice'


interface InvoiceDetail {
  courseId: string
  instructorName: string
  subtotal: number
  cgst: number
  sgst: number
  totalGST: number
}

interface Transaction {
  id: string
  courseName: string
  date: string
  amount: number
  gst: number
  status: 'Paid' | 'Pending' | 'Failed'
  paymentId: string
  orderId: string
  method: string
  companyName: string
  invoiceDate: string
  invoiceDetails: InvoiceDetail
}

const PaymentsTabScreen = () => {
  const navigation = useNavigation()
  const [expandedTransactionId, setExpandedTransactionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const dispatch = useDispatch<AppDispatch>();
  const selector = useSelector((state: any) => state.paymentHistory);

  // Format date from ISO string to readable format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch (error) {
      return dateString
    }
  }

  // Calculate GST from amount
  const calculateGST = (amountInPaisa: number) => {
    const amountInRupees = amountInPaisa / 100
    const totalGST = amountInRupees * 0.18 // 18% GST
    const cgst = totalGST / 2 // 9%
    const sgst = totalGST / 2 // 9%
    const subtotal = amountInRupees - totalGST

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      cgst: parseFloat(cgst.toFixed(2)),
      sgst: parseFloat(sgst.toFixed(2)),
      totalGST: parseFloat(totalGST.toFixed(2)),
    }
  }

  // Transform API response to Transaction format
  const transformApiResponse = (data: any[]): Transaction[] => {
    if (!data || !Array.isArray(data)) return []

    return data.map((item: any) => {
      const amountInRupees = item.amount / 100
      const gstData = calculateGST(item.amount)

      return {
        id: item.id || '',
        courseName: item.title || 'Unknown Course',
        date: formatDate(item.created_at),
        amount: amountInRupees,
        gst: gstData.totalGST,
        status: item.status === 'captured' ? 'Paid' : item.status,
        paymentId: item.razorpay_payment_id || '',
        orderId: item.razorpay_order_id || '',
        method: 'Razorpay',
        companyName: 'INLINE4 SOLUTIONS PRIVATE LIMITED',
        invoiceDate: formatDate(item.created_at),
        invoiceDetails: {
          courseId: item.id || '',
          instructorName: item.instructor_name || '',
          ...gstData,
        },
      }
    })
  }

  useEffect(() => {
    getPaymentHistory()
  }, [])

  // Update transactions when selector data changes
  useEffect(() => {
    if (selector?.data && Array.isArray(selector?.data)) {
      if (selector?.data.length > 0) {
        const transformedTransactions = transformApiResponse(selector?.data)
        setTransactions(transformedTransactions)
      } else {
        setTransactions([])
      }
      setIsLoading(false)
    } else if (selector?.error) {
      setTransactions([])
      setIsLoading(false)
    }
  }, [selector])
console.log(transactions, selector?.data, "transactionsss");

  const getPaymentHistory = async () => {
    try {
      setIsLoading(true)
      const response = await dispatch(getPaymentHistoryData() as any)
    } catch (error) {
      console.log("Error fetching payment history:", error)
      setIsLoading(false)
    }
  }

  console.log(selector, "selector in payments")

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalGST = transactions.reduce((sum, t) => sum + t.gst, 0)
  const coursesBought = transactions.length

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.iconContainer}>
        <Text style={styles.walletIcon}>💳</Text>
      </View>
      <Text style={styles.emptyTitle}>No transactions yet</Text>
      <Text style={styles.emptySubtitle}>Your course purchases will appear here</Text>
    </View>
  )

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isExpanded = expandedTransactionId === item.id

    return (
      <View style={styles.transactionWrapper}>
        <TouchableOpacity style={styles.transactionItem} onPress={() =>
                  setExpandedTransactionId(isExpanded ? null : item.id)
                }>
          <View style={styles.transactionLeft}>
            <View style={styles.courseIcon}>
              <Text style={styles.courseIconText}>📚</Text>
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.courseName}>{item.courseName}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
          </View>
          <View style={styles.transactionRight}>
            <View style={[styles.statusBadge, item.status === 'Paid' && styles.statusPaid]}>
              <Text style={styles.statusIcon}>✓</Text>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <View style={styles.amountAndDropdown}>
              <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
              >
                <Text style={[styles.dropdownIcon, isExpanded && styles.dropdownIconRotated]}>
                  ▼
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* Expanded Invoice Details */}
        {isExpanded && (
          <View style={styles.invoiceContainer}>
            {/* Tax Invoice Header */}
            <View style={styles.invoiceHeader}>
              <View>
                <Text style={styles.taxInvoiceLabel}>TAX INVOICE</Text>
                <Text style={styles.companyName}>{item.companyName}</Text>
              </View>
              <View style={styles.invoiceDateBadge}>
                <Text style={styles.invoiceDateLabel}>{item.invoiceDate}</Text>
              </View>
            </View>

            {/* Invoice Details Grid */}
            <View style={styles.invoiceDetailsGrid}>
              <View style={styles.invoiceGridItem}>
                <Text style={styles.invoiceGridLabel}>PAYMENT ID</Text>
                <Text style={styles.invoiceGridValue}>{item.paymentId}</Text>
              </View>
              <View style={styles.invoiceGridItem}>
                <Text style={styles.invoiceGridLabel}>ORDER ID</Text>
                <Text style={styles.invoiceGridValue}>{item.orderId}</Text>
              </View>
              <View style={styles.invoiceGridItem}>
                <Text style={styles.invoiceGridLabel}>METHOD</Text>
                <Text style={styles.invoiceGridValue}>{item.method}</Text>
              </View>
            </View>

            {/* Amount Label */}
            <View style={styles.amountLabelContainer}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amountValue}>₹{item.amount.toFixed(2)}</Text>
            </View>

            {/* Description and Amount Header */}
            <View style={styles.descriptionHeader}>
              <Text style={styles.descriptionHeaderLabel}>DESCRIPTION</Text>
              <Text style={styles.descriptionHeaderLabel}>AMOUNT</Text>
            </View>

            {/* Course Item */}
            <View style={styles.courseItemContainer}>
              <View>
                <Text style={styles.courseItemName}>{item.courseName}</Text>
                <Text style={styles.courseItemInstructor}>
                  Instructor: {item.invoiceDetails.instructorName}
                </Text>
              </View>
              <Text style={styles.courseItemAmount}>₹{item.invoiceDetails.subtotal.toFixed(2)}</Text>
            </View>

            {/* Divider */}
            <View style={styles.invoiceDivider} />

            {/* Subtotal and Tax Breakdown */}
            <View style={styles.taxBreakdown}>
              <View style={styles.taxRow}>
                <Text style={styles.taxLabel}>Subtotal (excl. GST)</Text>
                <Text style={styles.taxValue}>₹{item.invoiceDetails.subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.taxRow}>
                <Text style={styles.taxLabel}>CGST @ 9%</Text>
                <Text style={styles.taxValue}>₹{item.invoiceDetails.cgst.toFixed(2)}</Text>
              </View>
              <View style={styles.taxRow}>
                <Text style={styles.taxLabel}>SGST @ 9%</Text>
                <Text style={styles.taxValue}>₹{item.invoiceDetails.sgst.toFixed(2)}</Text>
              </View>
              <View style={styles.taxRowBold}>
                <Text style={styles.taxLabelBold}>Total GST (18%)</Text>
                <Text style={styles.taxValueBold}>₹{item.invoiceDetails.totalGST.toFixed(2)}</Text>
              </View>
              <View style={styles.totalPaidRow}>
                <Text style={styles.totalPaidLabel}>Total Paid</Text>
                <Text style={styles.totalPaidValue}>₹{item.amount.toFixed(2)}</Text>
              </View>
            </View>

            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
              This is a computer-generated invoice and does not require an actual signature. GST is applicable under reverse charge mechanism where applicable.
            </Text>
          </View>
        )}
      </View>
    )
  }

  const renderTransactionHistory = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Payment History</Text>
        <Text style={styles.historySubtitle}>All your course purchases with GST invoices</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TOTAL SPENT</Text>
          <Text style={styles.statValue}>₹{totalSpent.toFixed(2)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>COURSES BOUGHT</Text>
          <Text style={styles.statValue}>{coursesBought}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TOTAL GST PAID</Text>
          <Text style={styles.statValue}>₹{totalGST.toFixed(2)}</Text>
        </View>
      </View>

      {/* Transactions Label */}
      <View style={styles.transactionsLabel}>
        <Text style={styles.transactionsCount}>
          {transactions.length} TRANSACTION{transactions.length !== 1 ? 'S' : ''} — CLICK ANY ROW TO VIEW INVOICE
        </Text>
      </View>

      {/* Transaction List */}
      <View style={styles.transactionsList}>
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => (navigation.getParent() as DrawerNavigationProp<any>)?.openDrawer()}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {selector?.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#165DFC" />
          <Text style={styles.loadingText}>Loading payment history...</Text>
        </View>
      ) : (
        /* Content */
        transactions.length === 0 ? renderEmptyState() : renderTransactionHistory()
      )}
    </SafeAreaView>
  )
}

export default PaymentsTabScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#165DFC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
    textAlign: 'center',
  },
  filterButton: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 20,
    color: '#165DFC',
  },
  scrollContainer: {
    flex: 1,
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  walletIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
  },
  // Transaction History Styles
  historyHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  historySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: 'Geist-VariableFont_wght',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
  },
  transactionsLabel: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  transactionsCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
    letterSpacing: 0.3,
  },
  transactionsList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  transactionWrapper: {
    marginBottom: 10,
  },
  transactionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  courseIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseIconText: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  amountAndDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F0FDF4',
    marginBottom: 6,
  },
  statusPaid: {
    backgroundColor: '#DCFCE7',
  },
  statusIcon: {
    fontSize: 12,
    color: '#22C55E',
    marginRight: 4,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
    fontFamily: 'Geist-VariableFont_wght',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
  },
  dropdownButton: {
    padding: 4,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  dropdownIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  // Invoice Styles
  invoiceContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E5E7EB',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    marginBottom: 16,
  },
  taxInvoiceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  invoiceDateBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  invoiceDateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  invoiceDetailsGrid: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    gap: 12,
  },
  invoiceGridItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
  },
  invoiceGridLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  invoiceGridValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
  },
  amountLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 12,
  },
  descriptionHeaderLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
    letterSpacing: 0.3,
  },
  courseItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  courseItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  courseItemInstructor: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
  },
  courseItemAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  taxBreakdown: {
    gap: 10,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  taxLabel: {
    fontSize: 12,
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
  taxValue: {
    fontSize: 12,
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
  taxRowBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  taxLabelBold: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
  },
  taxValueBold: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
  },
  totalPaidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#1F2937',
    marginTop: 8,
  },
  totalPaidLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
  },
  totalPaidValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Geist-VariableFont_wght',
  },
  disclaimer: {
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 14,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
})