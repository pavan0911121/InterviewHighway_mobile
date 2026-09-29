import { StyleSheet, Text, View, TouchableOpacity, Pressable, ScrollView, RefreshControl, TextInput, ActivityIndicator, Linking, Modal } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useDispatch, useSelector } from 'react-redux'
import * as AsyncStore from "../../../AsyncStore";
import { getApplicationsList } from '../../../Redux/slices/employerApplicationsSlice'
import { ArrowDownToLine, Briefcase, Calendar, Check, CheckCircle2, ChevronDown, CircleX, Clock3, Download, Eye, FileText, Layers, Mail, Search, StickyNote, User, UserRound, UserRoundPlus, Users, X } from 'lucide-react-native'
import { addNotesToCandidateProfile, getJobPostingStats, updateApplicationStatus } from '../../../Redux/slices/jobPostings'
import JobsSkeleton from '../Jobs/JobsSkeleton'

const ApplicationStatusBadge = ({ status }: { status?: string }) => {
  const normalizedStatus = status?.toLowerCase()
  const config = normalizedStatus === 'reviewing'
    ? { label: 'Under Review', color: '#155EEF', icon: <Eye size={11} color="#155EEF" />, badgeStyle: styles.reviewingBadge }
    : normalizedStatus === 'shortlisted'
      ? { label: 'Shortlisted', color: '#A020F0', icon: <UserRoundPlus size={11} color="#A020F0" />, badgeStyle: styles.shortlistedBadge }
      : normalizedStatus === 'hired'
        ? { label: 'Hired', color: '#00A63E', icon: <CheckCircle2 size={11} color="#00A63E" />, badgeStyle: styles.hiredBadge }
        : normalizedStatus === 'rejected'
          ? { label: 'Rejected', color: '#E11D48', icon: <CircleX size={11} color="#E11D48" />, badgeStyle: styles.rejectedBadge }
          : { label: 'Pending Review', color: '#6B7280', icon: <Clock3 size={11} color="#6B7280" />, badgeStyle: styles.pendingBadge }

  return (
    <View style={[styles.statusBadge, config.badgeStyle]}>
      {config.icon}
      <Text style={[styles.statusBadgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  )
}

const ApplicationsScreen = () => {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState('All Jobs')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [jobFilterOpen, setJobFilterOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState('Newest First')
  const [sortFilterOpen, setSortFilterOpen] = useState(false)
  const [openStatusId, setOpenStatusId] = useState<string | number | null>(null)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({})
  const [notesModalVisible, setNotesModalVisible] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [notesContent, setNotesContent] = useState('')
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
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
        const jobs= await dispatch (getJobPostingStats(userId) as any);
      }
    } catch (error) {
      console.log("Error fetching user data from AsyncStorage:", error);
    }
  }

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await LocalStorageaData();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };
  const selector = useSelector((state: any) => state.employerApplications);
  const selectorData = selector?.data?.applications // Assuming the API returns an object with an "applications" array
  const isLoading = selector?.loading;
  const jobPostingSelector = useSelector((state: any) => state.jobPostings);
  const jobsdata = jobPostingSelector?.data?.jobs // Assuming the API returns an object with a "job_postings_stats" array
  const filteredApplications = useMemo(() => {
    if (!Array.isArray(selectorData)) return []

    const query = searchQuery.trim().toLowerCase()
    return selectorData.filter((application: any) => {
      const applicationJobId = application?.job_id ?? application?.job?.id
      const matchesJob = !selectedJobId || String(applicationJobId) === selectedJobId
      const matchesSearch = !query || [
        application?.candidate?.name,
        application?.candidate?.email,
      ].some((value) => String(value || '').toLowerCase().includes(query))
      return matchesJob && matchesSearch
    }).sort((left: any, right: any) => {
      const leftAppliedAt = Date.parse(left?.applied_at || '')
      const rightAppliedAt = Date.parse(right?.applied_at || '')
      const leftHasDate = Number.isFinite(leftAppliedAt)
      const rightHasDate = Number.isFinite(rightAppliedAt)

      if (!leftHasDate) return rightHasDate ? 1 : 0
      if (!rightHasDate) return -1
      return selectedSort === 'Oldest First'
        ? leftAppliedAt - rightAppliedAt
        : rightAppliedAt - leftAppliedAt
    })
  }, [searchQuery, selectedJobId, selectedSort, selectorData])

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

  const handleOpenNotes = (application: any) => {
    const existingNotes = typeof application?.notes === 'string'
      ? application.notes
      : application?.notes?.notes || ''
    setSelectedApplication(application)
    setNotesContent(existingNotes)
    setNotesModalVisible(true)
  }

  const handleSaveNotes = async () => {
    const applicationId = selectedApplication?.id
    const notes = notesContent.trim()
    if (!applicationId || !notes) return

    setIsSavingNotes(true)
    try {
      const userLoggedInData = await AsyncStore.getData(AsyncStore.Keys.USER_DATA)
      if (!userLoggedInData) throw new Error('User session is unavailable')
      const userId = JSON.parse(userLoggedInData)?.id
      if (!userId) throw new Error('User ID is unavailable')

      await (dispatch as any)(addNotesToCandidateProfile({
        userId: String(userId),
        candidateId: String(applicationId),
        notes,
      })).unwrap()
      await (dispatch as any)(getApplicationsList(userId)).unwrap()
      setNotesModalVisible(false)
    } catch (error) {
      console.error('Failed to save application notes', error)
    } finally {
      setIsSavingNotes(false)
    }
  }
  const loading = selector?.isApplicationsStatsLoading;
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
      {loading ? <JobsSkeleton />
        :
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
          style={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            <View style={styles.jobFilterWrapper}>
              <Pressable
                style={styles.filterButton}
                onPress={() => {
                  setJobFilterOpen((isOpen) => !isOpen)
                  setSortFilterOpen(false)
                }}
              >
                <Briefcase color="#666" size={20} />
                <Text style={styles.filterText} numberOfLines={1}>{selectedJob}</Text>
                <ChevronDown color="#999" size={20} />
              </Pressable>
              {jobFilterOpen && (
                <View style={styles.jobFilterMenu}>
                  <Pressable
                    style={[styles.jobFilterOption, !selectedJobId && styles.jobFilterOptionSelected]}
                    onPress={() => {
                      setSelectedJob('All Jobs')
                      setSelectedJobId(null)
                      setJobFilterOpen(false)
                    }}
                  >
                    <Text style={styles.jobFilterOptionText}>All Jobs</Text>
                  </Pressable>
                  <ScrollView style={styles.jobFilterOptions} nestedScrollEnabled>
                    {(Array.isArray(jobsdata) ? jobsdata : []).map((job: any) => (
                      <Pressable
                        key={String(job.id)}
                        style={[styles.jobFilterOption, selectedJobId === String(job.id) && styles.jobFilterOptionSelected]}
                        onPress={() => {
                          setSelectedJob(job.title || job.job_title || 'Untitled job')
                          setSelectedJobId(String(job.id))
                          setJobFilterOpen(false)
                        }}
                      >
                        <Text style={styles.jobFilterOptionText} numberOfLines={1}>{job.title || job.job_title || 'Untitled job'}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Sort Dropdown */}
            <View style={styles.sortFilterWrapper}>
              <Pressable
                style={styles.filterButton}
                onPress={() => {
                  setSortFilterOpen((isOpen) => !isOpen)
                  setJobFilterOpen(false)
                }}
              >
                <Calendar color="#666" size={20} />
                <Text style={styles.filterText}>{selectedSort}</Text>
                <ChevronDown color="#999" size={20} />
              </Pressable>
              {sortFilterOpen && (
                <View style={styles.sortFilterMenu}>
                  {['Newest First', 'Oldest First'].map((sortOption) => (
                    <Pressable
                      key={sortOption}
                      style={styles.sortFilterOption}
                      onPress={() => {
                        setSelectedSort(sortOption)
                        setSortFilterOpen(false)
                      }}
                    >
                      <Text style={styles.jobFilterOptionText}>{sortOption}</Text>
                      {selectedSort === sortOption && <Check size={15} color="#374151" />}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Empty State */}
          {filteredApplications.length > 0 ? (
            <View>
              {filteredApplications.map((application: any) => (
                <View style={[styles.applicationsListContainer, openStatusId === application.id && styles.applicationCardMenuOpen]} key={application.id}>
                  {openStatusId === application.id && (
                    <Pressable style={styles.cardDropdownDismissOverlay} onPress={() => setOpenStatusId(null)} />
                  )}
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
                      </View>
                      <ApplicationStatusBadge status={statusOverrides[String(application.id)] || application.status} />
                      <View style={styles.emailRow}>
                        <Mail size={16} color="#6B7280" />
                        <Text style={styles.emailText} numberOfLines={1}>{application?.candidate?.email}</Text>
                      </View>
                      {!!application?.notes && (
                        <View style={styles.savedNotesCard}>
                          <View style={styles.savedNotesHeading}>
                            <StickyNote size={13} color="#A16207" />
                            <Text style={styles.savedNotesLabel}>Your Notes:</Text>
                          </View>
                          <Text style={styles.savedNotesText}>
                            {typeof application.notes === 'string' ? application.notes : application.notes?.notes}
                          </Text>
                        </View>
                      )}
                      <View style={styles.statusMenuContainer}>
                        <Pressable style={styles.statusButton} onPress={() => setOpenStatusId(openStatusId === application.id ? null : application.id)}>
                          <Text style={styles.statusButtonText}>Change Status</Text>
                          <ChevronDown size={14} color="#111827" />
                        </Pressable>
                        {openStatusId === application.id && (
                          <View style={styles.statusMenu}>
                            {statusOptions.map((option) => (
                              <Pressable key={option.value} style={styles.statusOption} onPress={() => handleUpdateStatus(application, option.value)}>
                                {option.icon}
                                <Text style={styles.statusOptionText}>{option.label}</Text>
                              </Pressable>
                            ))}
                          </View>
                        )}
                      </View>
                      <View style={styles.applicationActionRow}>
                        <View style={styles.metaInfo}>
                          <Calendar size={13} color="#6B7280" />
                          <Text style={styles.metaText}>Applied {getApplicationAge(application.applied_at)}</Text>
                        </View>
                        <View style={styles.actionButtonsRow}>
                          <Pressable style={styles.primaryActionButton} onPress={() => handleViewProfile(application)}>
                            <UserRound color="#000000" size={15} />
                            <Text style={styles.primaryActionText}>View Profile</Text>
                          </Pressable>
                          {
                            application?.resume_url &&
                            <Pressable style={styles.secondaryActionButton} onPress={() => Linking.openURL(application?.resume_url)}>
                              <Download size={15} color="#374151" />
                              <Text style={styles.secondaryActionText}>Resume</Text>
                            </Pressable>
                          }
                          <Pressable style={styles.secondaryActionButton} onPress={() => handleOpenNotes(application)}>
                            <StickyNote size={15} color="#374151" />
                            <Text style={styles.secondaryActionText}>{application?.notes ? 'Edit Notes' : 'Add Notes'}</Text>
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
              <Text style={styles.emptyStateTitle}>
                {searchQuery.trim() || selectedJobId ? 'No matching applications' : 'No applications yet'}
              </Text>
              <Text style={styles.emptyStateDescription}>
                {searchQuery.trim() || selectedJobId
                  ? 'Try changing your search or selected job'
                  : 'Applications will appear here once candidates start applying to your jobs'}
              </Text>
              <TouchableOpacity style={styles.viewJobsButton}>
                <Briefcase color={'#fff'} size={20} />
                <Text style={styles.viewJobsButtonText}>View Your Jobs</Text>
              </TouchableOpacity>
            </View>
          )}
          {(openStatusId !== null || jobFilterOpen || sortFilterOpen) && (
            <Pressable
              style={styles.dropdownDismissOverlay}
              onPress={() => {
                setOpenStatusId(null)
                setJobFilterOpen(false)
                setSortFilterOpen(false)
              }}
            />
          )}
        </ScrollView>}
      <Modal
        visible={notesModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !isSavingNotes && setNotesModalVisible(false)}
      >
        <View style={styles.notesModalOverlay}>
          <View style={styles.notesModal}>
            <View style={styles.notesModalHeading}>
              <StickyNote size={16} color="#A16207" />
              <Text style={styles.notesModalTitle}>{selectedApplication?.notes ? 'Edit Notes' : 'Add Notes'}</Text>
            </View>
            <TextInput
              value={notesContent}
              onChangeText={setNotesContent}
              style={styles.notesInput}
              placeholder="Enter your notes"
              placeholderTextColor="#8A6D1D"
              multiline
              textAlignVertical="top"
              editable={!isSavingNotes}
            />
            <View style={styles.notesModalActions}>
              <Pressable
                style={styles.notesCancelButton}
                onPress={() => setNotesModalVisible(false)}
                disabled={isSavingNotes}
              >
                <Text style={styles.notesCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.notesSaveButton, isSavingNotes && styles.notesSaveButtonDisabled]}
                onPress={handleSaveNotes}
                disabled={isSavingNotes || !notesContent.trim()}
              >
                {isSavingNotes ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.notesSaveText}>Save Notes</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* )} */}
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
  jobFilterWrapper: { flex: 1, position: 'relative', zIndex: 20, elevation: 20 },
  sortFilterWrapper: { flex: 1, position: 'relative', zIndex: 20, elevation: 20 },
  jobFilterMenu: { position: 'absolute', top: 52, left: 0, right: 0, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D9DDE4', borderRadius: 8, shadowColor: '#000000', shadowOpacity: 0.16, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 21, zIndex: 21, overflow: 'hidden' },
  sortFilterMenu: { position: 'absolute', top: 52, left: 0, right: 0, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D9DDE4', borderRadius: 8, shadowColor: '#000000', shadowOpacity: 0.16, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 21, zIndex: 21, overflow: 'hidden' },
  sortFilterOption: { minHeight: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#F0F1F3' },
  jobFilterOptions: { maxHeight: 220 },
  jobFilterOption: { minHeight: 42, justifyContent: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F0F1F3' },
  jobFilterOptionSelected: { backgroundColor: '#EFF6FF' },
  jobFilterOptionText: { color: '#111827', fontSize: 13, fontFamily: 'Geist-VariableFont_wght' },
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
    position: 'relative',
    backgroundColor: '#F4F8FC',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#B4D7FD',
    marginBottom: 24,
  },
  applicationCardMenuOpen: { zIndex: 11, elevation: 11 },
  cardDropdownDismissOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  dropdownDismissOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
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
    position: 'relative',
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
    width: '50%',
    zIndex: 20,
    elevation: 20,
  },
  statusButton: {
    width: '100%',
    height: 30,
    borderWidth: 1,
    borderColor: '#CBD2DB',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  statusButtonText: {
    color: '#111827',
    fontSize: 11,
    fontFamily: 'Geist-VariableFont_wght',
  },
  statusMenu: {
    position: 'absolute',
    top: 34,
    left: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DDE4',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 21,
    zIndex: 21,
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
  statusBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2, marginVertical: 10 },
  statusBadgeText: { fontSize: 10, fontFamily: 'Geist-VariableFont_wght' },
  pendingBadge: { backgroundColor: '#FFFFFF', borderColor: '#CBD2DB' },
  reviewingBadge: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
  shortlistedBadge: { backgroundColor: '#FAF5FF', borderColor: '#D8B4FE' },
  hiredBadge: { backgroundColor: '#ECFDF3', borderColor: '#86EFAC' },
  rejectedBadge: { backgroundColor: '#FFF1F2', borderColor: '#FDA4AF' },
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
  savedNotesCard: { marginTop: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFCE8', borderWidth: 1, borderColor: '#F5D64A', borderRadius: 8, marginBottom: 10 },
  savedNotesHeading: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  savedNotesLabel: { color: '#111827', fontSize: 11, fontFamily: 'Geist-VariableFont_wght' },
  savedNotesText: { color: '#111827', fontSize: 11, lineHeight: 16, fontFamily: 'Geist-VariableFont_wght', paddingLeft: 18 },
  notesModalOverlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  notesModal: { width: '100%', maxWidth: 420, padding: 16, backgroundColor: '#FFFCE8', borderWidth: 1, borderColor: '#F5D64A', borderRadius: 8 },
  notesModalHeading: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 },
  notesModalTitle: { color: '#111827', fontSize: 15, fontWeight: '600', fontFamily: 'Geist-VariableFont_wght' },
  notesInput: { minHeight: 110, padding: 10, borderWidth: 1, borderColor: '#E8D879', borderRadius: 6, backgroundColor: '#FFFFFF', color: '#111827', fontSize: 13, fontFamily: 'Geist-VariableFont_wght' },
  notesModalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 14 },
  notesCancelButton: { minWidth: 80, height: 38, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#D6C76B', borderRadius: 6, backgroundColor: '#FFFFFF', paddingHorizontal: 12 },
  notesCancelText: { color: '#374151', fontSize: 13, fontFamily: 'Geist-VariableFont_wght' },
  notesSaveButton: { minWidth: 100, height: 38, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: '#111827', paddingHorizontal: 12 },
  notesSaveButtonDisabled: { opacity: 0.65 },
  notesSaveText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', fontFamily: 'Geist-VariableFont_wght' },
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
    marginVertical: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
  },
  actionButtonsRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    flexWrap: 'wrap',
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  primaryActionText: {
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