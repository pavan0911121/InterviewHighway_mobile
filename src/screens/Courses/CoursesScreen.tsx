import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const CoursesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { number: '8', label: 'Total Courses', color: '#165DFC' },
    { number: '8', label: 'Our Courses', color: '#22C55E' },
    { number: '0', label: 'Partner Courses', color: '#A855F7' },
    { number: '0', label: 'My Enrolled', color: '#F97316' },
  ];

  const courses = [
    {
      id: 1,
      title: 'pythonadvance2',
      instructor: 'by devpy',
      code: 'dfaff',
      level: 'Beginner',
      courseId: 'INR999',
    },
    {
      id: 2,
      title: 'pythonadvance2',
      instructor: 'by devpy',
      code: 'dfaff',
      level: 'Beginner',
      courseId: 'INR999',
    },
    {
      id: 3,
      title: 'pythonadvance2',
      instructor: 'by devpy',
      code: 'dfaff',
      level: 'Beginner',
      courseId: 'INR999',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Courses...."
          placeholderTextColor="#797979"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
          {courses.map((course) => (
            <View key={course.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <View>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseInstructor}>{course.instructor}</Text>
                  <Text style={styles.courseCode}>{course.code}</Text>
                </View>
              </View>

              <View style={styles.courseMeta}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{course.level}</Text>
                </View>
              </View>

              <View style={styles.courseFooter}>
                <Text style={styles.courseId}>{course.courseId}</Text>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonIcon}>▶</Text>
                  <Text style={styles.viewButtonText}>View Course</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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