import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useDispatch, useSelector } from 'react-redux'
import * as AsyncStore from "../../../AsyncStore";
import { getJobPostingStats } from '../../../Redux/slices/jobPostings'
import { Briefcase, CheckCircle, CircleX, Clock, Currency, DollarSign, EllipsisVertical, Eye, FileText, MapPin, PauseCircle, Plus, Search, Users } from 'lucide-react-native'




const JobsScreen = () => {
  const [userId, setUserId] = useState<string | null>(null);
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
        const response = await dispatch(getJobPostingStats(userId) as any);

      }
    } catch (error) {
      console.log("Error fetching user data from AsyncStorage:", error);
    }
  }
  const selector = useSelector((state: any) => state.jobPostings);
  const dashboardSelector = useSelector((state: any) => state.employerDashboard);
  const selectorData = selector?.data?.jobs;
  const isLoading = selector?.loading;
  console.log("Selector Data:", selectorData);

  // Calculate job stats from selectorData using useMemo
  const jobStats = useMemo(() => {
    if (!selectorData || !Array.isArray(selectorData)) {
      return {
        totalJobs: 0,
        activeJobs: 0,
        draftJobs: 0,
        pausedJobs: 0,
        closedJobs: 0,
      };
    }

    return {
      totalJobs: selectorData.length,
      activeJobs: selectorData.filter((job: any) => job.status === 'active').length,
      draftJobs: selectorData.filter((job: any) => job.status === 'draft').length,
      pausedJobs: selectorData.filter((job: any) => job.status === 'paused').length,
      closedJobs: selectorData.filter((job: any) => job.status === 'closed').length,
    };
  }, [selectorData]);

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

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#165DFC" />
        </View>
      ) : (
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Job Postings</Text>
            <Text style={styles.subtitle}>Manage your job listings and applications</Text>
          </View>

          {/* Create Job Button */}
          <TouchableOpacity style={styles.createJobButton}>
            <Plus color={'#fff'} />
            <Text style={styles.createJobButtonText}>Create Job</Text>
          </TouchableOpacity>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            {/* Total Jobs Card */}
            <View style={[styles.card, styles.totalJobsCard]}>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Total Jobs</Text>
                <Text style={styles.cardNumber}>{jobStats.totalJobs}</Text>
              </View>
              <Briefcase color={'#005FFF'} />
            </View>

            {/* Active Card */}
            <View style={[styles.card, styles.activeCard]}>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Active</Text>
                <Text style={[styles.cardNumber, styles.activeNumber]}>
                  {jobStats.activeJobs}
                </Text>
              </View>
              <CheckCircle color={'#00C853'} />

            </View>

            {/* Draft Card */}
            <View style={[styles.card, styles.draftCard]}>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Draft</Text>
                <Text style={styles.cardNumber}>
                  {jobStats.draftJobs}
                </Text>
              </View>
              <FileText color={'#475567'} />
            </View>

            {/* Paused Card */}
            <View style={[styles.card, styles.pausedCard]}>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Paused</Text>
                <Text style={[styles.cardNumber, styles.pausedNumber]}>
                  {jobStats.pausedJobs}
                </Text>
              </View>
              <PauseCircle color={'#FF9500'} />
            </View>

            {/* Closed Card */}
            <View style={[styles.card, styles.closedCard]}>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Closed</Text>
                <Text style={[styles.cardNumber, styles.closedNumber]}>
                  {jobStats.closedJobs}
                </Text>
              </View>
              <CircleX color={'#FF3B30'} />
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search color={'#999'} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs by title, location, or description"
              placeholderTextColor="#999"
            />
          </View>

          {/* Job Listings */}
          <View style={styles.jobListingsContainer}>
            {selectorData && selectorData.length > 0 ? (
              selectorData.map((job: any) => (
                <View key={job.id} style={styles.jobCard}>
                  {/* Header with Title and Menu */}
                  <View style={styles.jobHeaderRow}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <TouchableOpacity>
                      <EllipsisVertical color={'black'} />
                    </TouchableOpacity>
                  </View>

                  {/* Status Badge */}
                  <View style={styles.statusBadgeContainer}>
                    {job.status === 'closed' && <CircleX color={'#FF3B30'} size={16} />}
                    {job.status === 'paused' && <PauseCircle color={'#FF9500'} size={16} />}
                    {job.status === 'draft' && <FileText color={'#475567'} size={16} />}
                    {job.status === 'active' && <CheckCircle color={'#00C853'} size={16} />}
                    <Text style={[
                      styles.statusBadgeText,
                      {
                        color: job.status === 'closed' ? '#FF3B30' :
                          job.status === 'paused' ? '#FF9500' :
                            job.status === 'draft' ? '#475567' :
                              job.status === 'active' ? '#00C853' : '#165DFC'
                      }
                    ]}>
                      {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                    </Text>
                  </View>

                  {/* Description */}
                  <Text style={styles.jobDescription} numberOfLines={2}>
                    {job.description}
                  </Text>

                  {/* Location */}
                  <View style={styles.jobInfoRow}>
                    <MapPin color={'#666'} size={18} />
                    <Text style={styles.jobInfoText}>{job.location}</Text>
                  </View>

                  {/* Job Type */}
                  <View style={styles.jobInfoRow}>
                    <Briefcase color={'#666'} size={18} />
                    <Text style={styles.jobInfoText}>
                      {job.employment_type?.replace('_', ' ').charAt(0).toUpperCase() + job.employment_type?.replace('_', ' ').slice(1)} • {job.experience_level?.charAt(0).toUpperCase() + job.experience_level?.slice(1)}
                    </Text>
                  </View>

                  {/* Salary */}
                  {job.salary_min && job.salary_max && (
                    <View style={styles.jobInfoRow}>
                      <DollarSign color={'#666'} size={18} />
                      <Text style={styles.jobInfoText}>{job.currency} {job.salary_min} - {job.salary_max}</Text>
                    </View>
                  )}

                  {/* Stats Row */}
                  <View style={styles.jobStatsRow}>
                    <View style={styles.statItem}>
                      <Users color={'#666'} size={18} />
                      <Text style={styles.statText}>{job.application_count || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Eye color={'#666'} size={18} />
                      <Text style={styles.statText}>{job.view_count || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Clock color={'#666'} size={18} />
                      <Text style={styles.statText}>{new Date(job.created_at).toLocaleDateString()}</Text>
                    </View>
                  </View>

                  {/* View Applications Button */}
                  <TouchableOpacity style={styles.viewApplicationsButton}>
                    <Users color={'#165DFC'} size={20} />
                    <Text style={styles.viewApplicationsButtonText}>View Applications</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginVertical: 20, color: '#666' }}>No job listings found</Text>
            )}
          </View>
        </ScrollView>
      )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  scrollContent: {
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