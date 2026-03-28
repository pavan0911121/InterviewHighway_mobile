import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'

const JobsScreen = () => {
  const navigation = useNavigation()
  const [jobs] = useState({
    total: 1,
    active: 0,
    draft: 0,
    paused: 0,
    closed: 1,
  })
  const [searchQuery, setSearchQuery] = useState('')

  const [jobListings] = useState([
    {
      id: '1',
      title: 'aws engineer',
      status: 'Closed',
      description: 'Job saved as draft, visible in jobs list.Job saved as draft, visible in jobs list.Job saved as draft,...',
      location: 'hyderabad',
      type: 'Internship',
      level: 'Entry',
      salary: 'INR 200,000 - 200,000',
      applications: 0,
      views: 0,
      postedTime: '1 months ago',
    },
  ])

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

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Job Postings</Text>
          <Text style={styles.subtitle}>Manage your job listings and applications</Text>
        </View>

        {/* Create Job Button */}
        <TouchableOpacity style={styles.createJobButton}>
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          <Text style={styles.createJobButtonText}>Create Job</Text>
        </TouchableOpacity>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Total Jobs Card */}
          <View style={[styles.card, styles.totalJobsCard]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Total Jobs</Text>
              <Text style={styles.cardNumber}>{jobs.total}</Text>
            </View>
            <MaterialCommunityIcons
              name="briefcase-multiple"
              size={40}
              color="#165DFC"
              style={styles.cardIcon}
            />
          </View>

          {/* Active Card */}
          <View style={[styles.card, styles.activeCard]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Active</Text>
              <Text style={[styles.cardNumber, styles.activeNumber]}>{jobs.active}</Text>
            </View>
            <MaterialCommunityIcons
              name="check-circle"
              size={40}
              color="#00C853"
              style={styles.cardIcon}
            />
          </View>

          {/* Draft Card */}
          <View style={[styles.card, styles.draftCard]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Draft</Text>
              <Text style={styles.cardNumber}>{jobs.draft}</Text>
            </View>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={40}
              color="#165DFC"
              style={styles.cardIcon}
            />
          </View>

          {/* Paused Card */}
          <View style={[styles.card, styles.pausedCard]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Paused</Text>
              <Text style={[styles.cardNumber, styles.pausedNumber]}>{jobs.paused}</Text>
            </View>
            <MaterialCommunityIcons
              name="pause-circle-outline"
              size={40}
              color="#FF9500"
              style={styles.cardIcon}
            />
          </View>

          {/* Closed Card */}
          <View style={[styles.card, styles.closedCard]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Closed</Text>
              <Text style={[styles.cardNumber, styles.closedNumber]}>{jobs.closed}</Text>
            </View>
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={40}
              color="#FF3B30"
              style={styles.cardIcon}
            />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs by title, location, or description"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Job Listings */}
        <View style={styles.jobListingsContainer}>
          {jobListings.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              {/* Header with Title and Menu */}
              <View style={styles.jobHeaderRow}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <TouchableOpacity>
                  <MaterialCommunityIcons name="dots-vertical" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Status Badge */}
              <View style={styles.statusBadgeContainer}>
                <MaterialCommunityIcons name="close-circle" size={16} color="#FF3B30" />
                <Text style={styles.statusBadgeText}>{job.status}</Text>
              </View>

              {/* Description */}
              <Text style={styles.jobDescription} numberOfLines={2}>
                {job.description}
              </Text>

              {/* Location */}
              <View style={styles.jobInfoRow}>
                <MaterialCommunityIcons name="map-marker" size={18} color="#666" />
                <Text style={styles.jobInfoText}>{job.location}</Text>
              </View>

              {/* Job Type */}
              <View style={styles.jobInfoRow}>
                <MaterialCommunityIcons name="building-outline" size={18} color="#666" />
                <Text style={styles.jobInfoText}>
                  {job.type} • {job.level}
                </Text>
              </View>

              {/* Salary */}
              <View style={styles.jobInfoRow}>
                <MaterialCommunityIcons name="currency-inr" size={18} color="#666" />
                <Text style={styles.jobInfoText}>{job.salary}</Text>
              </View>

              {/* Stats Row */}
              <View style={styles.jobStatsRow}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="account-multiple" size={18} color="#666" />
                  <Text style={styles.statText}>{job.applications}</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="eye" size={18} color="#666" />
                  <Text style={styles.statText}>{job.views}</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="clock-outline" size={18} color="#666" />
                  <Text style={styles.statText}>{job.postedTime}</Text>
                </View>
              </View>

              {/* View Applications Button */}
              <TouchableOpacity style={styles.viewApplicationsButton}>
                <MaterialCommunityIcons name="account-multiple" size={20} color="#165DFC" />
                <Text style={styles.viewApplicationsButtonText}>View Applications</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default JobsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
  headerContainer: {
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
    fontSize: 16,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
  },
  createJobButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    alignSelf: 'flex-end',
  },
  createJobButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Geist-VariableFont_wght',
  },
  statsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  totalJobsCard: {
    borderWidth: 2,
    borderColor: '#165DFC',
  },
  activeCard: {
    backgroundColor: '#fff',
  },
  draftCard: {
    backgroundColor: '#fff',
  },
  pausedCard: {
    backgroundColor: '#fff',
  },
  closedCard: {
    backgroundColor: '#fff',
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  activeNumber: {
    color: '#00C853',
  },
  pausedNumber: {
    color: '#FF9500',
  },
  closedNumber: {
    color: '#FF3B30',
  },
  cardIcon: {
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    padding: 0,
  },
  jobListingsContainer: {
    marginBottom: 24,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  jobHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
    fontFamily: 'Geist-VariableFont_wght',
    marginLeft: 6,
  },
  jobDescription: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 18,
    marginBottom: 12,
  },
  jobInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobInfoText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    marginLeft: 10,
  },
  jobStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    marginLeft: 6,
  },
  viewApplicationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#165DFC',
    backgroundColor: '#F0F5FF',
    gap: 8,
  },
  viewApplicationsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
})