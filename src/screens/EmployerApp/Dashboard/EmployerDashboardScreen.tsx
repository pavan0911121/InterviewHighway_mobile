import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const EmployerDashboardScreen = () => {
  // Sample data - replace with API data later
  const [companyData] = useState({
    companyName: 'Test Company Ltd',
    staffId: '1dev',
    totalJobs: 1,
    activeJobs: 0,
    totalApplications: 0,
    pendingReview: 0,
    shortlisted: 0,
    candidatesInPipeline: 0,
    hired: 0,
    conversionRate: 0,
  })

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome back, {companyData.companyName} {companyData.staffId}!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Here's an overview of your recruitment activities
          </Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.cardsContainer}>
          {/* Total Jobs Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Total Jobs</Text>
              <View style={[styles.cardIcon, styles.iconBlue]}>
                <Text style={styles.iconText}>🏢</Text>
              </View>
            </View>
            <Text style={styles.cardValue}>{companyData.totalJobs}</Text>
            <Text style={styles.cardSubtext}>{companyData.activeJobs} active</Text>
          </View>

          {/* Total Applications Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Total Applications</Text>
              <View style={[styles.cardIcon, styles.iconPurple]}>
                <Text style={styles.iconText}>👥</Text>
              </View>
            </View>
            <Text style={styles.cardValue}>{companyData.totalApplications}</Text>
            <Text style={styles.cardSubtext}>{companyData.pendingReview} pending review</Text>
          </View>

          {/* Shortlisted Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Shortlisted</Text>
              <View style={[styles.cardIcon, styles.iconYellow]}>
                <Text style={styles.iconText}>⏱️</Text>
              </View>
            </View>
            <Text style={styles.cardValue}>{companyData.shortlisted}</Text>
            <Text style={styles.cardSubtext}>Candidates in pipeline</Text>
          </View>

          {/* Hired Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Hired</Text>
              <View style={[styles.cardIcon, styles.iconGreen]}>
                <Text style={styles.iconText}>✓</Text>
              </View>
            </View>
            <Text style={styles.cardValue}>{companyData.hired}</Text>
            <Text style={styles.cardSubtext}>{companyData.conversionRate}% conversion rate</Text>
          </View>
        </View>

        {/* No Applications Yet Section */}
        <View style={styles.emptyStateCard}>
          <View style={styles.emptyStateIconContainer}>
            <Text style={styles.emptyStateIcon}>👥</Text>
          </View>
          <Text style={styles.emptyStateTitle}>No applications yet</Text>
          <Text style={styles.emptyStateDescription}>
            Applications will appear here once candidates start applying to your jobs.
          </Text>
          <TouchableOpacity style={styles.postJobButton}>
            <Text style={styles.postJobButtonText}>Post a Job</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EmployerDashboardScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingVertical: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    fontFamily: 'Geist-VariableFont_wght',
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBlue: {
    backgroundColor: '#E0E7FF',
  },
  iconPurple: {
    backgroundColor: '#F3E8FF',
  },
  iconYellow: {
    backgroundColor: '#FEF3C7',
  },
  iconGreen: {
    backgroundColor: '#D1FAE5',
  },
  iconText: {
    fontSize: 24,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: '#999999',
    fontFamily: 'Geist-VariableFont_wght',
  },
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  emptyStateIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateIcon: {
    fontSize: 36,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginBottom: 16,
  },
  postJobButton: {
    backgroundColor: '#165DFC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  postJobButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
})