import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'

const ApplicationsScreen = () => {
  const [applications] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
    unviewed: 0,
    jobs: 0,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState('All Jobs')
  const [selectedSort, setSelectedSort] = useState('Newest First')

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>All Applications</Text>
            <Text style={styles.subtitle}>Manage applications across all job postings</Text>
          </View>
          <TouchableOpacity style={styles.listViewButton}>
            <MaterialCommunityIcons name="view-list" size={20} color="#000" />
            <Text style={styles.listViewButtonText}>List View</Text>
          </TouchableOpacity>
        </View>

        {/* Application Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Total Card */}
          <View style={[styles.statsCard, styles.totalCard]}>
            <Text style={[styles.statsNumber, styles.totalNumber]}>
              {applications.total}
            </Text>
            <Text style={styles.statsLabel}>Total</Text>
          </View>

          {/* Pending Card */}
          <View style={[styles.statsCard, styles.pendingCard]}>
            <Text style={[styles.statsNumber, styles.pendingNumber]}>
              {applications.pending}
            </Text>
            <Text style={styles.statsLabel}>Pending</Text>
          </View>

          {/* Reviewing Card */}
          <View style={[styles.statsCard, styles.reviewingCard]}>
            <Text style={[styles.statsNumber, styles.reviewingNumber]}>
              {applications.reviewing}
            </Text>
            <Text style={styles.statsLabel}>Reviewing</Text>
          </View>

          {/* Shortlisted Card */}
          <View style={[styles.statsCard, styles.shortlistedCard]}>
            <Text style={[styles.statsNumber, styles.shortlistedNumber]}>
              {applications.shortlisted}
            </Text>
            <Text style={styles.statsLabel}>Shortlisted</Text>
          </View>

          {/* Rejected Card */}
          <View style={[styles.statsCard, styles.rejectedCard]}>
            <Text style={[styles.statsNumber, styles.rejectedNumber]}>
              {applications.rejected}
            </Text>
            <Text style={styles.statsLabel}>Rejected</Text>
          </View>

          {/* Hired Card */}
          <View style={[styles.statsCard, styles.hiredCard]}>
            <Text style={[styles.statsNumber, styles.hiredNumber]}>
              {applications.hired}
            </Text>
            <Text style={styles.statsLabel}>Hired</Text>
          </View>

          {/* Unviewed Card */}
          <View style={[styles.statsCard, styles.unviewedCard]}>
            <Text style={[styles.statsNumber, styles.unviewedNumber]}>
              {applications.unviewed}
            </Text>
            <Text style={styles.statsLabel}>Unviewed</Text>
          </View>

          {/* Jobs Card */}
          <View style={[styles.statsCard, styles.jobsCard]}>
            <Text style={[styles.statsNumber, styles.jobsNumber]}>
              {applications.jobs}
            </Text>
            <Text style={styles.statsLabel}>Jobs</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by candidate name"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Dropdowns */}
        <View style={styles.filterRow}>
          {/* All Jobs Dropdown */}
          <TouchableOpacity style={styles.filterButton}>
            <MaterialCommunityIcons name="briefcase-outline" size={20} color="#666" />
            <Text style={styles.filterText}>{selectedJob}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#999" />
          </TouchableOpacity>

          {/* Sort Dropdown */}
          <TouchableOpacity style={styles.filterButton}>
            <MaterialCommunityIcons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.filterText}>{selectedSort}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons name="account-multiple" size={80} color="#A9BDCC" />
          <Text style={styles.emptyStateTitle}>No applications yet</Text>
          <Text style={styles.emptyStateDescription}>
            Applications will appear here once candidates start applying to your jobs
          </Text>
          <TouchableOpacity style={styles.viewJobsButton}>
            <MaterialCommunityIcons name="briefcase" size={20} color="#fff" />
            <Text style={styles.viewJobsButtonText}>View Your Jobs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ApplicationsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Geist-VariableFont_wght',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
  },
  listViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 6,
  },
  listViewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    width: '48%',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  totalCard: {
    borderWidth: 2,
    borderColor: '#165DFC',
    backgroundColor: '#fff',
  },
  pendingCard: {
    backgroundColor: '#fff',
  },
  reviewingCard: {
    backgroundColor: '#fff',
  },
  shortlistedCard: {
    backgroundColor: '#fff',
  },
  rejectedCard: {
    backgroundColor: '#fff',
  },
  hiredCard: {
    backgroundColor: '#fff',
  },
  unviewedCard: {
    backgroundColor: '#FFF8E6',
  },
  jobsCard: {
    backgroundColor: '#E5EDFF',
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  totalNumber: {
    color: '#165DFC',
  },
  pendingNumber: {
    color: '#165DFC',
  },
  reviewingNumber: {
    color: '#165DFC',
  },
  shortlistedNumber: {
    color: '#9C27B0',
  },
  rejectedNumber: {
    color: '#FF3B30',
  },
  hiredNumber: {
    color: '#00C853',
  },
  unviewedNumber: {
    color: '#FF9500',
  },
  jobsNumber: {
    color: '#165DFC',
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    gap: 8,
  },
  filterText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  emptyStateContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  viewJobsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  viewJobsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
})