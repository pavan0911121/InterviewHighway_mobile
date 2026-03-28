import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'

const AnalyticsScreen = () => {
  const [analytics] = useState({
    totalJobs: 1,
    activeJobs: 0,
    totalApplications: 0,
    pendingReview: 0,
    hiredCandidates: 0,
    shortlisted: 0,
    conversionRate: 0.0,
    statusBreakdown: {
      pending: 0,
      shortlisted: 0,
      hired: 0,
      rejected: 0,
    },
  })
  const [selectedPeriod, setSelectedPeriod] = useState('30 Days')

  const handleRefresh = () => {
    // Handle refresh logic
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerRow}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.titleSecond}>Dashboard</Text>
            <Text style={styles.subtitle}>Comprehensive insights for Test Company Ltd 1dev</Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <MaterialCommunityIcons name="refresh" size={20} color="#000" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Metrics Cards */}
        <View style={styles.metricsContainer}>
          {/* Total Jobs Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Total Jobs</Text>
              <View style={[styles.metricIcon, styles.blueIcon]}>
                <MaterialCommunityIcons name="briefcase-outline" size={28} color="#165DFC" />
              </View>
            </View>
            <Text style={[styles.metricNumber, styles.blueNumber]}>{analytics.totalJobs}</Text>
            <Text style={styles.metricSubtitle}>{analytics.activeJobs} active</Text>
          </View>

          {/* Total Applications Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Total Applications</Text>
              <View style={[styles.metricIcon, styles.purpleIcon]}>
                <MaterialCommunityIcons name="account-multiple-outline" size={28} color="#9C27B0" />
              </View>
            </View>
            <Text style={[styles.metricNumber, styles.purpleNumber]}>{analytics.totalApplications}</Text>
            <Text style={styles.metricSubtitle}>{analytics.pendingReview} pending review</Text>
          </View>

          {/* Hired Candidates Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Hired Candidates</Text>
              <View style={[styles.metricIcon, styles.greenIcon]}>
                <MaterialCommunityIcons name="account-check-outline" size={28} color="#00C853" />
              </View>
            </View>
            <Text style={[styles.metricNumber, styles.greenNumber]}>{analytics.hiredCandidates}</Text>
            <Text style={styles.metricSubtitle}>{analytics.shortlisted} shortlisted</Text>
          </View>
        </View>

        {/* Conversion Rate Card */}
        <View style={styles.conversionCard}>
          <View style={styles.conversionHeader}>
            <Text style={styles.conversionLabel}>Conversion Rate</Text>
            <View style={[styles.conversionIcon, styles.orangeIcon]}>
              <MaterialCommunityIcons name="trending-up" size={28} color="#FF9500" />
            </View>
          </View>
          <Text style={styles.conversionRate}>{analytics.conversionRate}%</Text>
          <Text style={styles.conversionSubtitle}>Applications to hires</Text>
        </View>

        {/* Applications Timeline Card */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineTitleSection}>
            <View>
              <Text style={styles.timelineTitle}>Applications</Text>
              <Text style={styles.timelineTitleSecond}>Timeline</Text>
              <Text style={styles.timelineDescription}>Track application trends over time</Text>
            </View>
          </View>

          {/* Time Period Selector */}
          <View style={styles.timePeriodContainer}>
            <TouchableOpacity
              style={[
                styles.timePeriodButton,
                selectedPeriod === '7 Days' && styles.timePeriodButtonActive,
              ]}
              onPress={() => setSelectedPeriod('7 Days')}
            >
              <Text
                style={[
                  styles.timePeriodText,
                  selectedPeriod === '7 Days' && styles.timePeriodTextActive,
                ]}
              >
                7 Days
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.timePeriodButton,
                selectedPeriod === '30 Days' && styles.timePeriodButtonActive,
              ]}
              onPress={() => setSelectedPeriod('30 Days')}
            >
              <Text
                style={[
                  styles.timePeriodText,
                  selectedPeriod === '30 Days' && styles.timePeriodTextActive,
                ]}
              >
                30 Days
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.timePeriodButton,
                selectedPeriod === '90 Days' && styles.timePeriodButtonActive,
              ]}
              onPress={() => setSelectedPeriod('90 Days')}
            >
              <Text
                style={[
                  styles.timePeriodText,
                  selectedPeriod === '90 Days' && styles.timePeriodTextActive,
                ]}
              >
                90 Days
              </Text>
            </TouchableOpacity>
          </View>

          {/* Chart Placeholder */}
          <View style={styles.chartPlaceholder}>
            <MaterialCommunityIcons name="chart-box-outline" size={56} color="#A9BDCC" />
            <Text style={styles.chartPlaceholderText}>Timeline Chart will appear here</Text>
            <Text style={styles.chartPlaceholderSubtext}>0 data points loaded</Text>
          </View>
        </View>

        {/* Status Summary Card */}
        <View style={styles.statusSummaryCard}>
          <Text style={styles.statusSummaryTitle}>Status Summary</Text>
          <Text style={styles.statusSummarySubtitle}>Current application status breakdown</Text>

          {/* Status Items */}
          <View style={styles.statusItemsContainer}>
            {/* Pending */}
            <View style={styles.statusRow}>
              <View style={styles.statusDot}>
                <View style={[styles.statusDotCircle, styles.pendingDot]} />
                <Text style={styles.statusLabel}>Pending</Text>
              </View>
              <Text style={styles.statusValue}>{analytics.statusBreakdown.pending}</Text>
            </View>

            {/* Shortlisted */}
            <View style={styles.statusRow}>
              <View style={styles.statusDot}>
                <View style={[styles.statusDotCircle, styles.shortlistedDot]} />
                <Text style={styles.statusLabel}>Shortlisted</Text>
              </View>
              <Text style={styles.statusValue}>{analytics.statusBreakdown.shortlisted}</Text>
            </View>

            {/* Hired */}
            <View style={styles.statusRow}>
              <View style={styles.statusDot}>
                <View style={[styles.statusDotCircle, styles.hiredDot]} />
                <Text style={styles.statusLabel}>Hired</Text>
              </View>
              <Text style={styles.statusValue}>{analytics.statusBreakdown.hired}</Text>
            </View>

            {/* Rejected */}
            <View style={styles.statusRow}>
              <View style={styles.statusDot}>
                <View style={[styles.statusDotCircle, styles.rejectedDot]} />
                <Text style={styles.statusLabel}>Rejected</Text>
              </View>
              <Text style={styles.statusValue}>{analytics.statusBreakdown.rejected}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.statusDivider} />

          {/* Total Applications */}
          <View style={styles.totalApplicationsRow}>
            <Text style={styles.totalApplicationsLabel}>Total Applications</Text>
            <Text style={styles.totalApplicationsValue}>{analytics.totalApplications}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AnalyticsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 36,
  },
  titleSecond: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    marginTop: 8,
    lineHeight: 18,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 6,
    backgroundColor: '#f8f8f8',
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  metricsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
  },
  metricIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueIcon: {
    backgroundColor: '#E5EDFF',
  },
  purpleIcon: {
    backgroundColor: '#F3E5FF',
  },
  greenIcon: {
    backgroundColor: '#E8F5E9',
  },
  metricNumber: {
    fontSize: 40,
    fontWeight: '700',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 6,
    lineHeight: 44,
  },
  blueNumber: {
    color: '#165DFC',
  },
  purpleNumber: {
    color: '#9C27B0',
  },
  greenNumber: {
    color: '#00C853',
  },
  metricSubtitle: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
  },
  conversionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: 16,
  },
  conversionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  conversionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
  },
  conversionIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orangeIcon: {
    backgroundColor: '#FFF3E0',
  },
  conversionRate: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 6,
    lineHeight: 44,
  },
  conversionSubtitle: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: 24,
  },
  timelineTitleSection: {
    marginBottom: 18,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 22,
  },
  timelineTitleSecond: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 22,
  },
  timelineDescription: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    marginTop: 8,
    lineHeight: 18,
  },
  timePeriodContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  timePeriodButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 0,
  },
  timePeriodButtonActive: {
    backgroundColor: '#000',
  },
  timePeriodText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
  },
  timePeriodTextActive: {
    color: '#fff',
  },
  chartPlaceholder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D0D0D0',
    borderRadius: 12,
    paddingVertical: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 12,
    textAlign: 'center',
  },
  chartPlaceholderSubtext: {
    fontSize: 12,
    color: '#BBB',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    marginTop: 4,
    textAlign: 'center',
  },
  statusSummaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: 24,
  },
  statusSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 6,
  },
  statusSummarySubtitle: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    marginBottom: 16,
  },
  statusItemsContainer: {
    gap: 12,
    marginBottom: 14,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDotCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pendingDot: {
    backgroundColor: '#FF9500',
  },
  shortlistedDot: {
    backgroundColor: '#165DFC',
  },
  hiredDot: {
    backgroundColor: '#00C853',
  },
  rejectedDot: {
    backgroundColor: '#FF3B30',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  statusDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 14,
  },
  totalApplicationsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalApplicationsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  totalApplicationsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
})