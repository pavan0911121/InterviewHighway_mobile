import { StyleSheet, Text, View, TouchableOpacity, Pressable, ScrollView, TextInput, ActivityIndicator, Linking } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useDispatch, useSelector } from 'react-redux'
import * as AsyncStore from "../../../AsyncStore";
import { getApplicationsList } from '../../../Redux/slices/employerApplicationsSlice'
import { ArrowDownToLine, Briefcase, Calendar, ChevronDown, Clock3, Download, Eye, FileText, Layers, Mail, Search, User, UserRound, Users } from 'lucide-react-native'
import { updateApplicationStatus } from '../../../Redux/slices/jobPostings'


const ApplicationsScreen = () => {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState('All Jobs')
  const [selectedSort, setSelectedSort] = useState('Newest First')
  const [openStatusId, setOpenStatusId] = useState<string | number | null>(null)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({})
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
        const response = await dispatch(getApplicationsList(userId) as any);

      }
    } catch (error) {
      console.log("Error fetching user data from AsyncStorage:", error);
    }
  }
  const selector = useSelector((state: any) => state.employerApplications);
  const selectorData = selector?.data?.applications // Assuming the API returns an object with an "applications" array
  const isLoading = selector?.loading;
  
  // Calculate application stats from selectorData using useMemo
  const applicationStats = useMemo(() => {
    if (!selectorData || !Array.isArray(selectorData)) {
      return {
        total: 0,
        pending: 0,
        reviewing: 0,
        shortlisted: 0,
        rejected: 0,
        hired: 0,
        unviewed: 0,
        jobs: 0,
      };
    }

    return {
      total: selectorData.length,
      pending: selectorData.filter((app: any) => app.status === 'pending').length,
      reviewing: selectorData.filter((app: any) => app.status === 'reviewing').length,
      shortlisted: selectorData.filter((app: any) => app.status === 'shortlisted').length,
      rejected: selectorData.filter((app: any) => app.status === 'rejected').length,
      hired: selectorData.filter((app: any) => app.status === 'hired').length,
      unviewed: selectorData.filter((app: any) => app.viewed_by_employer === false).length,
      jobs: new Set(selectorData.map((app: any) => app.job_id)).size, // Count unique jobs
    };
  }, [selectorData]);
  const handleViewProfile = (application: any) => {
    (navigation.navigate as any)('CandidateProfile', { candidateData: application, candidateId: application?.user_id, email: application?.candidate?.email });
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending Review', icon: <Clock3 size={14} color="#6B7280" /> },
    { value: 'reviewing', label: 'Under Review', icon: <Eye size={14} color="#155EEF" /> },
    { value: 'shortlisted', label: 'Shortlist', icon: <UserRound size={14} color="#A020F0" /> },
    { value: 'hired', label: 'Hire Candidate', icon: <UserRound size={14} color="#00A63E" /> },
    { value: 'rejected', label: 'Reject', icon: <UserRound size={14} color="#E11D48" /> },
  ]

  const getApplicationAge = (appliedAt?: string) => {
    if (!appliedAt) return 'Date unavailable'
    const appliedDate = new Date(appliedAt)
    if (Number.isNaN(appliedDate.getTime())) return 'Date unavailable'
    const elapsedDays = Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24))
    return elapsedDays <= 0 ? 'Today' : `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`
  }

  const handleUpdateStatus = async (application: any, status: string) => {
    setOpenStatusId(null)
    setStatusOverrides((current) => ({ ...current, [String(application.id)]: status }))
    try {
      const userLoggedInData = await AsyncStore.getData(AsyncStore.Keys.USER_DATA)
      if (!userLoggedInData) return
      const userId = JSON.parse(userLoggedInData)?.id
      await (dispatch as any)(updateApplicationStatus({
        applicationId: String(application.id),
        body: { status, userId },
      })).unwrap()
      await (dispatch as any)(getApplicationsList(userId))
    } catch (error) {
      console.error('Failed to update application status', error)
    }
  }

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
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>All Applications</Text>
              <Text style={styles.subtitle}>Manage applications across all job postings</Text>
            </View>
            <TouchableOpacity style={styles.listViewButton}>
              <Layers color={'#000000'} size={15} />
              <Text style={styles.listViewButtonText}>List View</Text>
            </TouchableOpacity>
          </View>

          {/* Application Stats Grid */}
          <View style={styles.statsGrid}>
            {/* Total Card */}
            <View style={[styles.statsCard, styles.totalCard]}>
              <Text style={[styles.statsNumber, styles.totalNumber]}>
                {applicationStats?.total}
              </Text>
              <Text style={styles.statsLabel}>Total</Text>
            </View>

            {/* Pending Card */}
            <View style={[styles.statsCard, styles.pendingCard]}>
              <Text style={[styles.statsNumber, styles.pendingNumber]}>
                {applicationStats?.pending}
              </Text>
              <Text style={styles.statsLabel}>Pending</Text>
            </View>

            {/* Reviewing Card */}
            <View style={[styles.statsCard, styles.reviewingCard]}>
              <Text style={[styles.statsNumber, styles.reviewingNumber]}>
                {applicationStats?.reviewing}
              </Text>
              <Text style={styles.statsLabel}>Reviewing</Text>
            </View>

            {/* Shortlisted Card */}
            <View style={[styles.statsCard, styles.shortlistedCard]}>
              <Text style={[styles.statsNumber, styles.shortlistedNumber]}>
                {applicationStats?.shortlisted}
              </Text>
              <Text style={styles.statsLabel}>Shortlisted</Text>
            </View>

            {/* Rejected Card */}
            <View style={[styles.statsCard, styles.rejectedCard]}>
              <Text style={[styles.statsNumber, styles.rejectedNumber]}>
                {applicationStats?.rejected}
              </Text>
              <Text style={styles.statsLabel}>Rejected</Text>
            </View>

            {/* Hired Card */}
            <View style={[styles.statsCard, styles.hiredCard]}>
              <Text style={[styles.statsNumber, styles.hiredNumber]}>
                {applicationStats?.hired}
              </Text>
              <Text style={styles.statsLabel}>Hired</Text>
            </View>

            {/* Unviewed Card */}
            <View style={[styles.statsCard, styles.unviewedCard]}>
              <Text style={[styles.statsNumber, styles.unviewedNumber]}>
                {applicationStats?.unviewed}
              </Text>
              <Text style={styles.statsLabel}>Unviewed</Text>
            </View>

            {/* Jobs Card */}
            <View style={[styles.statsCard, styles.jobsCard]}>
              <Text style={[styles.statsNumber, styles.jobsNumber]}>
                {applicationStats?.jobs}
              </Text>
              <Text style={styles.statsLabel}>Jobs</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search color={'#999999'} size={16} style={styles.searchIcon} />
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
              <Briefcase color={'#666'} size={20} />
              <Text style={styles.filterText}>{selectedJob}</Text>
              <ChevronDown color={'#999'} size={20} />
            </TouchableOpacity>

            {/* Sort Dropdown */}
            <TouchableOpacity style={styles.filterButton}>
              <Calendar color={'#666'} size={20} />
              <Text style={styles.filterText}>{selectedSort}</Text>
              <ChevronDown color={'#999'} size={20} />
            </TouchableOpacity>
          </View>

          {/* Empty State */}
          {selector?.data?.applications?.length > 0 ? (
            <View>
              {selector?.data?.applications?.map((application: any) => (
                <View style={styles.applicationsListContainer} key={application.id}>
                  <View style={styles.applicationCard}>
                    <View style={styles.avatarContainer}>
                      <Text style={styles.avatarText}>{application?.candidate?.name?.[0] || 'T'}</Text>
                    </View>
                    <View style={styles.applicationMainContent}>
                      <View style={styles.cardHeaderRow}>
                        <View style={styles.candidateNameBlock}>
                          <Text style={styles.candidateName}>{application?.candidate?.name}</Text>
                          {application?.viewed_by_employer === false && <Text style={styles.newBadge}>New</Text>}
                        </View>
                        <View style={styles.statusMenuContainer}>
                          <Pressable style={styles.statusButton} onPress={() => setOpenStatusId(openStatusId === application.id ? null : application.id)}>
                            <Text style={styles.statusButtonText}>
                              {statusOptions.find((option) => option.value === (statusOverrides[String(application.id)] || application.status))?.label || application.status}
                            </Text>
                            <ChevronDown size={14} color="#111827" />
                          </Pressable>
                          {openStatusId === application.id && (
                            <View style={styles.statusMenu}>
                              <Text style={styles.statusMenuTitle}>Change Status</Text>
                              {statusOptions.map((option) => (
                                <Pressable key={option.value} style={styles.statusOption} onPress={() => handleUpdateStatus(application, option.value)}>
                                  {option.icon}
                                  <Text style={styles.statusOptionText}>{option.label}</Text>
                                </Pressable>
                              ))}
                            </View>
                          )}
                        </View>
                      </View>
                      <View style={styles.statusRow}>
                        <View style={styles.statusItem}>
                          <Clock3 size={14} color="#111827" />
                          <Text style={styles.statusText}>{application?.status}</Text>
                        </View>
                      </View>
                      <View style={styles.emailRow}>
                        <Mail size={16} color="#6B7280" />
                        <Text style={styles.emailText} numberOfLines={1}>{application?.candidate?.email}</Text>
                      </View>
                      <View style={styles.applicationActionRow}>
                        <View style={styles.metaInfo}>
                          <Calendar size={13} color="#6B7280" />
                          <Text style={styles.metaText}>Applied {getApplicationAge(application.applied_at)}</Text>
                        </View>
                        <View style={styles.actionButtonsRow}>
                          <Pressable style={styles.primaryActionButton} onPress={() => handleViewProfile(application)}>
                            <UserRound color="#FFFFFF" size={15} />
                            <Text style={styles.primaryActionText}>View Profile</Text>
                          </Pressable>
                          <Pressable style={styles.secondaryActionButton}>
                            <Download size={15} color="#374151" />
                            <Text style={styles.secondaryActionText}>Resume</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Users color={'#E0E0E0'} size={48} />
              <Text style={styles.emptyStateTitle}>No applications yet</Text>
              <Text style={styles.emptyStateDescription}>
                Applications will appear here once candidates start applying to your jobs
              </Text>
              <TouchableOpacity style={styles.viewJobsButton}>
                <Briefcase color={'#fff'} size={20} />
                <Text style={styles.viewJobsButtonText}>View Your Jobs</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default ApplicationsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingVertical: 15,
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
  applicationsListContainer: {
    backgroundColor: '#F4F8FC',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#B4D7FD',
    marginBottom: 24,
  },
  applicationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: '#F4F8FC',
    borderRadius: 16,
    padding: 14,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Geist-VariableFont_wght',
  },
  applicationMainContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  candidateNameBlock: {
    flex: 1,
    paddingRight: 8,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
  },
  newBadge: {
    alignSelf: 'flex-start',
    color: '#FFFFFF',
    backgroundColor: '#155EEF',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    overflow: 'hidden',
    fontFamily: 'Geist-VariableFont_wght',
  },
  statusMenuContainer: {
    position: 'relative',
    zIndex: 10,
  },
  statusButton: {
    minWidth: 112,
    height: 32,
    borderWidth: 1,
    borderColor: '#CBD2DB',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
  },
  statusButtonText: {
    color: '#111827',
    fontSize: 11,
    fontFamily: 'Geist-VariableFont_wght',
  },
  statusMenu: {
    position: 'absolute',
    top: 37,
    right: 0,
    width: 178,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DDE4',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    zIndex: 20,
  },
  statusMenuTitle: {
    color: '#111827',
    fontSize: 12,
    fontFamily: 'Geist-VariableFont_wght',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusOption: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  statusOptionText: {
    color: '#111827',
    fontSize: 12,
    fontFamily: 'Geist-VariableFont_wght',
  },
  badgeContainer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Geist-VariableFont_wght',
  },
  statusRow: {
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  emailText: {
    fontSize: 12,
    color: '#4B5563',
    fontFamily: 'Geist-VariableFont_wght',
    flexShrink: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  applicationActionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  primaryActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Geist-VariableFont_wght',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  secondaryActionText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
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