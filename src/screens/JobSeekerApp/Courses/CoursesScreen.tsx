import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Funnel } from 'lucide-react-native/icons';
import FilterModal from '../Dashboard/FilterModal';
import { getCourses } from '../../../Redux/slices/coursesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react-native';

const CoursesScreen = () => {
  const navigation = useNavigation();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const dispatch = useDispatch();
    const selector = useSelector((state: any) => state.courses);

  useEffect(() => {
    getCoursesData();
  }, []);
  const getCoursesData = async () => {
    try {
      // Make API call to fetch courses
      const response = await dispatch(getCourses() as any);
      console.log('Courses Response:', response);
    } catch (error) {
      console.log('Error fetching courses:', error);
    }
  };
  const stats = [
    { number: selector?.courses?.length || 0, label: 'Total Courses', color: '#165DFC' },
    { number: selector?.courses?.length || 0, label: 'Our Courses', color: '#22C55E' },
    { number: '0', label: 'Partner Courses', color: '#A855F7' },
    { number: '0', label: 'My Enrolled', color: '#F97316' },
  ];

  const courses = selector?.courses
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
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Funnel size={15} />
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Learning Hub</Text>
            <Text style={styles.headerSubtitle}>
              Continue your enrolled courses or discover new ones to advance your career
            </Text>
          </View>

          <View style={styles.marketplaceSection}>
            <View style={styles.marketplaceIcon}>
               <Search color={'#00A63E'}/>
            </View>
            <View style={styles.marketplaceContent}>
              <Text style={styles.marketplaceTitle}>Course Marketplace</Text>
              <Text style={styles.marketplaceSubtitle}>
                Discover new courses to advance your skills
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={[styles.statNumber, { color: stat.color }]}>
                {stat.number}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Courses List */}
        <View style={styles.coursesContainer}>
          {courses?.map((course:any) => (
            <View key={course?.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <View>
                  <Text style={styles.courseTitle}>{course?.title}</Text>
                  <Text style={styles.courseInstructor}>{course?.instructor_name}</Text>
                  <Text style={styles.courseCode}>{course?.slug}</Text>
                </View>
              </View>

              <View style={styles.courseMeta}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{course?.level}</Text>
                </View>
              </View>

              <View style={styles.courseFooter}>
                <Text style={styles.courseId}>{course?.currency}{course?.price}</Text>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonIcon}>▶</Text>
                  <Text style={styles.viewButtonText}>View Course</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
      />
    </SafeAreaView>
  );
};

export default CoursesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEBEE',
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerSection: {
    marginTop: 16,
    marginBottom: 20,
  },
  headerContent: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 20,
  },
  marketplaceSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  marketplaceIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  marketplaceIconText: {
    fontSize: 20,
  },
  marketplaceContent: {
    flex: 1,
  },
  marketplaceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  marketplaceSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 16,
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEBEE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
  },
  coursesContainer: {
    marginBottom: 20,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEBEE',
    padding: 16,
    marginBottom: 12,
  },
  courseHeader: {
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: '#E0F7E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '500',
    fontFamily: 'Geist-VariableFont_wght',
  },
  courseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#165DFC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  viewButtonIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily: 'Geist-VariableFont_wght',
  },
});