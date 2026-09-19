import React, { useEffect, useState, useMemo,useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { JobSeekerBottomTabParamList } from '../../../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getJobDetails, getRecommendedJobs, getUserMetaData, getAppliedJobs, getSavedJobsList, handleReloadJobs} from '../../../Redux/slices/homeSlice';
import { Funnel, Search } from 'lucide-react-native/icons';
import FilterModal, { Filters, INITIAL_FILTERS } from './FilterModal';
import JobDetailsModal from './JobDetailsModal';
import WithdrawApplicationModal from './WithdrawApplicationModal';
import * as AsyncStore from "../../../AsyncStore";
import { getProfileById } from '../../../Redux/slices/homeSlice';
import { useIsFocused } from '@react-navigation/native';




type Props = BottomTabScreenProps<JobSeekerBottomTabParamList, 'HomeTab'>;

export default function HomeTabScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState('recommended');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [showWithdrawApplicationModal, setShowWithdrawApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<Filters>(INITIAL_FILTERS);
  const selector = useSelector((state: any) => state.home);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const selectedJob = selector?.jobDetails;


  const savedJobs = selector?.savedJobs?.savedJobs;
  const appliedJobs = selector?.appliedJobs?.applications;

  useEffect(() => {
    if (isFocused) {
      getJobsData();
      getSavedJobsData();
    }
    if(selector?.reloadJobs) {
      getJobsData();
    }
  }, [isFocused, selector?.reloadJobs]);
  
  const getSavedJobsData = async () => {
    try {
       const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
      if (userId) {
        const resultId = userId.replace(/"/g, '');
        await dispatch(getSavedJobsList({ userId: resultId }) as any);
      }
    } catch (error) {
      console.log('Error fetching saved jobs:', error);
    }
  };
  const getJobsData = async () => {
    try {
      const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
      if (userId) {
        const resultId = userId.replace(/"/g, '');
        await dispatch(getProfileById(resultId) as any);
        await dispatch(getAppliedJobs(resultId) as any);
      }
      // Make API call to fetch recommended jobs
      await dispatch(getRecommendedJobs() as any);
      await dispatch(getUserMetaData() as any);
      await dispatch(handleReloadJobs(false))
    } catch (error) {
      console.log('Error fetching recommended jobs:', error);
    }
  };

  const jobs = selector?.recommendedJobs?.jobs;

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];

    const appliedJobIds = new Set(
      Array.isArray(appliedJobs)
        ? appliedJobs.map((application: any) => application?.job?.id).filter(Boolean)
        : []
    );
    const activeLocations = Object.keys(appliedFilters.location || {}).filter(
      (loc) => appliedFilters.location[loc]
    );
    const activeExperiences = Object.keys(appliedFilters.experience || {}).filter(
      (exp) => appliedFilters.experience[exp]
    );
    const activeJobTypes = Object.keys(appliedFilters.jobType || {}).filter(
      (type) => appliedFilters.jobType[type]
    );
    const minSalary = appliedFilters.salary || 0;

    const query = searchQuery.trim().toLowerCase();

    return jobs.filter((job: any) => {
      // Do not show jobs the user has already applied for.
      if (appliedJobIds.has(job?.id)) {
        return false;
      }

      // 0. Search query filter (title, company name, location)
      if (query.length > 0) {
        const titleMatch = job?.title?.toLowerCase().includes(query);
        const companyMatch = job?.companies?.name?.toLowerCase().includes(query) || job?.company?.toLowerCase().includes(query);
        const locationMatch = job?.location?.toLowerCase().includes(query);
        if (!titleMatch && !companyMatch && !locationMatch) {
          return false;
        }
      }

      // 1. Location filter
      if (activeLocations.length > 0) {
        const jobLoc = job?.location?.trim();
        if (!jobLoc || !appliedFilters.location[jobLoc]) {
          return false;
        }
      }

      // 2. Experience level filter (experience_level)
      if (activeExperiences.length > 0) {
        const jobExp = job?.experience_level?.trim();
        if (!jobExp || !appliedFilters.experience[jobExp]) {
          return false;
        }
      }

      // 3. Job Type filter (employment_type)
      if (activeJobTypes.length > 0) {
        const jobType = job?.employment_type?.trim();
        if (!jobType || !appliedFilters.jobType[jobType]) {
          return false;
        }
      }

      // 4. Minimum salary filter (salary_min)
      if (minSalary > 0) {
        const jobSalary = job?.salary_min ?? job?.salary_max;
        if (jobSalary == null || jobSalary < minSalary) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, appliedJobs, appliedFilters, searchQuery]);

  function underscoreToSpace(str: any) {
    return str ? str.replace(/_/g, " ") : "";
  }

  const handleApplyFilters = (filters: Filters) => {
    setAppliedFilters(filters);
  };
  const handleGetJobDetails = async (jobId: string) => {

    try {
      await dispatch(getJobDetails(jobId) as any);
      setShowJobDetailsModal(true);
    } catch (error) {
      console.error("Failed to get job details:", error);
    }
  };
  const handleOpenWithdrawApplicationModal = (application: any) => {
    setSelectedApplication(application);
    setShowWithdrawApplicationModal(true);
  };
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
        <View style={styles.searchContainer}>
          <Search size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for 'job title'"
            placeholderTextColor="#797979"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Funnel size={15} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recommended' && styles.tabActive]}
          onPress={() => setActiveTab('recommended')}
        >
          <View style={styles.tabLabelContainer}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'recommended' && styles.tabTextActive,
              ]}
            >
              Recommended
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{filteredJobs?.length}</Text>
            </View>
          </View>
          {activeTab === 'recommended' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'applied' && styles.tabActive]}
          onPress={() => setActiveTab('applied')}
        >
          <View style={styles.tabLabelContainer}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'applied' && styles.tabTextActive,
              ]}
            >
              Applied Jobs
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{appliedJobs?.length}</Text>
            </View>
          </View>
          {activeTab === 'applied' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
          onPress={() => setActiveTab('saved')}
        >
          <View style={styles.tabLabelContainer}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'saved' && styles.tabTextActive,
              ]}
            >
              Saved Jobs
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{savedJobs?.length||0}</Text>
            </View>
          </View>
          {activeTab === 'saved' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Job Listings */}
      {activeTab === 'recommended' ? (
        <ScrollView style={styles.jobsContainer} showsVerticalScrollIndicator={false}>
          {filteredJobs?.length > 0 ? (
            filteredJobs?.map((job: any, index: number) => (
              <TouchableOpacity key={`${job?.id}-${index}`} style={styles.jobCard} onPress={() => handleGetJobDetails(job?.id)}>
                <View style={styles.jobCompanyLogo}>
                  <Text style={styles.companyInitials}>{job?.company}</Text>
                </View>
                <View style={styles.jobDetails}>
                  <Text style={styles.jobTitle}>{job?.title}</Text>
                  <Text style={styles.jobCompany}>{job?.companies?.name}</Text>
                  <Text style={styles.jobMeta}>
                    {job?.location} • {underscoreToSpace(job?.employment_type)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No jobs found for selected filters</Text>
            </View>
          )}
        </ScrollView>
      ) : activeTab === 'applied' ? (
       <ScrollView style={styles.jobsContainer} showsVerticalScrollIndicator={false}>
          {appliedJobs?.length > 0 ? (
            appliedJobs?.map((job: any, index: number) => (
              <TouchableOpacity key={`${job?.id}-${index}`} style={styles.jobCard} onPress={() => handleOpenWithdrawApplicationModal(job)}>
                <View style={styles.jobCompanyLogo}>
                  <Text style={styles.companyInitials}>{job?.company}</Text>
                </View>
                <View style={styles.jobDetails}>
                  <Text style={styles.jobTitle}>{job?.job?.title}</Text>
                  <Text style={styles.jobCompany}>{job?.job?.company?.name}</Text>
                  <Text style={styles.jobMeta}>
                    {job?.job?.location} • {underscoreToSpace(job?.job?.employment_type)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No jobs found for selected filters</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.jobsContainer} showsVerticalScrollIndicator={false}>
         {savedJobs?.length > 0 ? (
            savedJobs?.map((job: any, index: number) => (
              <TouchableOpacity key={`${job?.id}-${index}`} style={styles.jobCard} onPress={() => handleGetJobDetails(job?.id)}>
                <View style={styles.jobCompanyLogo}>
                  <Text style={styles.companyInitials}>{job?.company}</Text>
                </View>
                <View style={styles.jobDetails}>
                  <Text style={styles.jobTitle}>{job?.job?.title}</Text>
                  <Text style={styles.jobCompany}>{job?.job?.company?.name}</Text>
                  <Text style={styles.jobMeta}>
                    {job?.job?.location} • {underscoreToSpace(job?.job?.employmentType)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No jobs found for selected filters</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        appliedFilters={appliedFilters}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        visible={showJobDetailsModal}
        onClose={() => setShowJobDetailsModal(false)}
        job={selectedJob}
      />

      <WithdrawApplicationModal
        visible={showWithdrawApplicationModal}
        application={selectedApplication}
        onClose={() => setShowWithdrawApplicationModal(false)}
      />
    </SafeAreaView>
  );
}

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
  searchContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderColor: '#EAEBEE',
    borderRadius: 8,
    flex: 1,
  },
  searchInput: {

    height: 40,
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    paddingHorizontal: 12,
    // backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: 'transparent',

  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 20,
    color: '#363535',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEBEE',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
    position: 'relative',
  },
  tabActive: {},
  tabLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 11,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#165DFC',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#DBEAFF',
    borderRadius: 10,
    paddingHorizontal: 0,
    paddingVertical: 5,
    minWidth: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -8,
    width: '80%',
    height: 3,
    backgroundColor: '#165DFC',
    borderRadius: 2,
  },
  jobsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  jobCard: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEBEE',
    gap: 12,
    alignItems: 'flex-start',
  },
  jobCompanyLogo: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  jobDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    marginBottom: 4,
    fontFamily: 'Geist-VariableFont_wght',
  },
  jobCompany: {
    fontSize: 12,
    color: '#4A5565',
    marginBottom: 4,
    fontFamily: 'Geist-VariableFont_wght',
  },
  jobMeta: {
    fontSize: 12,
    color: '#4A5565',
    fontFamily: 'Geist-VariableFont_wght',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#4A5565',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
});