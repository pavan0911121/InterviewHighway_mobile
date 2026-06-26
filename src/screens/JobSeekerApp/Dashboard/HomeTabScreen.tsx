import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { JobSeekerBottomTabParamList } from '../../../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getRecommendedJobs } from '../../../Redux/slices/homeSlice';
import { Funnel, Search } from 'lucide-react-native/icons';
import FilterModal from './FilterModal';
import * as AsyncStore from "../../../AsyncStore";


type Props = BottomTabScreenProps<JobSeekerBottomTabParamList, 'HomeTab'>;

export default function HomeTabScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState('recommended');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const selector = useSelector((state: any) => state.home);
  const dispatch = useDispatch();

  const recommendedCount = selector?.recommendedJobs?.total || 0;
  const appliedCount = selector?.appliedJobs?.total || 0;
  const savedCount = selector?.savedJobs?.total || 0;

  useEffect(() => {
    getRecommendedJobsData();
  }, []);
  const getRecommendedJobsData = async () => {
    try {
      // Make API call to fetch recommended jobs
      await dispatch(getRecommendedJobs() as any);
    } catch (error) {
      console.log('Error fetching recommended jobs:', error);
    }
  };

  const jobs = selector?.recommendedJobs?.jobs
  function underscoreToSpace(str: any) {
    return str.replace(/_/g, " ");
  }

  const handleApplyFilters = (filters: any) => {
    console.log('Applied Filters:', filters);
    // You can dispatch an action here to filter jobs based on the selected filters
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
              <Text style={styles.badgeText}>{recommendedCount}</Text>
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
              <Text style={styles.badgeText}>{appliedCount}</Text>
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
              <Text style={styles.badgeText}>{savedCount}</Text>
            </View>
          </View>
          {activeTab === 'saved' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Job Listings */}
      {activeTab === 'recommended' ? (
        <ScrollView style={styles.jobsContainer} showsVerticalScrollIndicator={false}>
          {jobs?.map((job: any) => (
            <TouchableOpacity key={job?.id} style={styles.jobCard}>
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
          ))}
        </ScrollView>
      ) : activeTab === 'applied' ? (
        <ScrollView style={styles.jobsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No applied jobs yet</Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.jobsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No saved jobs yet</Text>
          </View>
        </ScrollView>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
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