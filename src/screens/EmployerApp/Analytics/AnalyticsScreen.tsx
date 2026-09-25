import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getEmployerJobPerformance } from '../../../Redux/slices/employerAnalyticsSlice'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useDispatch, useSelector } from 'react-redux'
import { getJobPostingStats } from '../../../Redux/slices/jobPostings'
import { getEmployerTimeline } from '../../../Redux/slices/employerAnalyticsSlice'
import * as AsyncStore from "../../../AsyncStore";
import { getEmployerAnalytics } from '../../../Redux/slices/employerAnalyticsSlice'
import { Briefcase, ChartColumn, RefreshCcw, TrendingUp, UserCheck, Users } from 'lucide-react-native'
import EmployerDashboardSkeleton from '../Dashboard/EmployerDashboardSkeleton'

const AnalyticsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 Days')
  const navigation = useNavigation()
  const dispatch = useDispatch();

  useEffect(() => {
    LocalStorageaData();
  }, [])

  //get user data from async storage and set it to state
  const LocalStorageaData = async () => {
    try {
      const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);
      if (userLoggedInData) {
        const parsedUserData = JSON.parse(userLoggedInData);
        const userId = parsedUserData?.id || null;
        await dispatch(getEmployerAnalytics(userId) as any);
        await dispatch(getEmployerTimeline(userId) as any);
        await dispatch(getEmployerJobPerformance(userId) as any);

      }
    } catch (error) {
      console.log("Error fetching user data from AsyncStorage:", error);
    }
  }
  const selector = useSelector((state: any) => state.employerAnalytics);
  const isLoading = selector?.loading;
  const analytics = selector?.data
  const timelineData = selector?.timelineData
  const jobPerformanceData = selector?.jobPerformanceData
  const statusData = selector?.data

  const handleRefresh = () => {
    // Handle refresh logic
  }
  const loader = !(
    selector?.isemployerAnalyticsLoading === false &&
    selector?.isemployerTimelineLoading === false &&
    selector?.isemployerJobPerformanceLoading === false
  );
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
      </View>
      {/* {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#165DFC" />
        </View>
      ) : ( */}
      {
        loader ?
          <EmployerDashboardSkeleton />
          :
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.headerRow}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>Analytics</Text>
                <Text style={styles.titleSecond}>Dashboard</Text>
                <Text style={styles.subtitle}>Comprehensive insights for Test Company Ltd 1dev</Text>
              </View>
              <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                <RefreshCcw size={15} color="#000" />
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
                    <Briefcase size={15} color="#165DFC" />
                  </View>
                </View>
                <Text style={[styles.metricNumber, styles.blueNumber]}>{analytics?.totalJobs}</Text>
                <Text style={styles.metricSubtitle}>{analytics?.activeJobs} active</Text>
              </View>

              {/* Total Applications Card */}
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>Total {'\n'}Applications</Text>
                  <View style={[styles.metricIcon, styles.purpleIcon]}>
                    <Users size={15} color="#9C27B0" />
                  </View>
                </View>
                <Text style={[styles.metricNumber, styles.purpleNumber]}>{analytics?.totalApplications}</Text>
                <Text style={styles.metricSubtitle}>{analytics?.pendingApplications} pending review</Text>
              </View>

              {/* Hired Candidates Card */}
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>Hired {'\n'}Candidates</Text>
                  <View style={[styles.metricIcon, styles.greenIcon]}>
                    <UserCheck size={15} color="#00C853" />
                  </View>
                </View>
                <Text style={[styles.metricNumber, styles.greenNumber]}>{analytics?.hiredCount}</Text>
                <Text style={styles.metricSubtitle}>{analytics?.shortlistedCount} shortlisted</Text>
              </View>
              {/* Conversion Rate Card */}
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>Conversion {'\n'}Rate</Text>
                  <View style={[styles.metricIcon, styles.orangeIcon]}>
                    <TrendingUp size={15} color="#FF9500" />
                  </View>
                </View>
                <Text style={styles.conversionRate}>{analytics?.conversionRate}%</Text>
                <Text style={styles.conversionSubtitle}>Applications to hires</Text>
              </View>
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
                <ChartColumn size={56} color="#A9BDCC" />
                <Text style={styles.chartPlaceholderText}>Timeline Chart will appear here</Text>
                <Text style={styles.chartPlaceholderSubtext}>{timelineData?.length || 0} data points loaded</Text>
              </View>
            </View>

            {/* Jobs Performance Card */}
            <View style={styles.performanceCard}>
              <Text style={styles.performanceTitle}>Jobs Performance</Text>
              <Text style={styles.performanceSubtitle}>Application breakdown by job posting</Text>
              <View style={styles.performanceChartPlaceholder}>
                <ChartColumn size={42} color="#8996A7" strokeWidth={1.8} />
                <Text style={styles.performanceChartText}>Performance Chart will appear here</Text>
                <Text style={styles.performanceChartSubtext}>{jobPerformanceData?.length || 0} jobs loaded</Text>
              </View>
            </View>

            {/* Application Status Distribution Card */}
            <View style={styles.performanceCard}>
              <Text style={styles.performanceTitle}>Application Status Distribution</Text>
              <Text style={styles.performanceSubtitle}>Breakdown of application statuses</Text>
              <View style={styles.performanceChartPlaceholder}>
                <ChartColumn size={42} color="#8996A7" strokeWidth={1.8} />
                <Text style={styles.performanceChartText}>Status Distribution Chart will appear here</Text>
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
                  <Text style={styles.statusValue}>{statusData?.pendingApplications}</Text>
                </View>

                {/* Shortlisted */}
                <View style={styles.statusRow}>
                  <View style={styles.statusDot}>
                    <View style={[styles.statusDotCircle, styles.shortlistedDot]} />
                    <Text style={styles.statusLabel}>Shortlisted</Text>
                  </View>
                  <Text style={styles.statusValue}>{statusData?.shortlistedCount}</Text>
                </View>

                {/* Hired */}
                <View style={styles.statusRow}>
                  <View style={styles.statusDot}>
                    <View style={[styles.statusDotCircle, styles.hiredDot]} />
                    <Text style={styles.statusLabel}>Hired</Text>
                  </View>
                  <Text style={styles.statusValue}>{statusData?.hiredCount}</Text>
                </View>

                {/* Rejected */}
                <View style={styles.statusRow}>
                  <View style={styles.statusDot}>
                    <View style={[styles.statusDotCircle, styles.rejectedDot]} />
                    <Text style={styles.statusLabel}>Rejected</Text>
                  </View>
                  <Text style={styles.statusValue}>{statusData?.rejectedCount}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.statusDivider} />

              {/* Total Applications */}
              <View style={styles.totalApplicationsRow}>
                <Text style={styles.totalApplicationsLabel}>Total Applications</Text>
                <Text style={styles.totalApplicationsValue}>{statusData?.totalApplications}</Text>
              </View>
            </View>


          </ScrollView>
      }
      {/* )} */}

    </SafeAreaView>
  )
}

export default AnalyticsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
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
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 36,
  },
  titleSecond: {
    fontSize: 28,
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
    columnGap: 16,
    rowGap: 16,
    marginBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    width: '47%',
    minHeight: 176,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
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
    width: 25,
    height: 25,
    borderRadius: 6,
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
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#D9DDE4',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  performanceTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Geist-VariableFont_wght',
  },
  performanceSubtitle: {
    color: '#253044',
    fontSize: 11,
    marginTop: 10,
    fontFamily: 'Geist-VariableFont_wght',
  },
  performanceChartPlaceholder: {
    minHeight: 246,
    marginTop: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#AEBCCC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  performanceChartText: {
    color: '#253044',
    fontSize: 11,
    marginTop: 12,
    textAlign: 'center',
    fontFamily: 'Geist-VariableFont_wght',
  },
  performanceChartSubtext: {
    color: '#657080',
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'Geist-VariableFont_wght',
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