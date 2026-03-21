import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = BottomTabScreenProps<BottomTabParamList, 'HomeTab'>;

export default function HomeTabScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState('recommended');

  const jobs = [
    {
      id: 1,
      company: 'TCL',
      title: 'Senior DB Engineer',
      companyName: 'Test Company Ltd 1dev',
      location: 'Mumbai',
      type: 'full_time',
    },
    {
      id: 2,
      company: 'TCL',
      title: 'Senior DB Engineer',
      companyName: 'Test Company Ltd 1dev',
      location: 'Mumbai',
      type: 'full_time',
    },
    {
      id: 3,
      company: 'TCL',
      title: 'Senior DB Engineer',
      companyName: 'Test Company Ltd 1dev',
      location: 'Mumbai',
      type: 'full_time',
    },
    {
      id: 4,
      company: 'TCL',
      title: 'Senior DB Engineer',
      companyName: 'Test Company Ltd 1dev',
      location: 'Mumbai',
      type: 'full_time',
    },
    {
      id: 5,
      company: 'TCL',
      title: 'Senior DB Engineer',
      companyName: 'Test Company Ltd 1dev',
      location: 'Mumbai',
      type: 'full_time',
    },
    {
      id: 6,
      company: 'TCL',
      title: 'Senior DB Engineer',
      companyName: 'Test Company Ltd 1dev',
      location: 'Mumbai',
      type: 'full_time',
    },
    {
      id: 7,
      company: 'TCL',
      title: 'Senior DB Engineer',
      companyName: 'Test Company Ltd 1dev',
      location: 'Mumbai',
      type: 'full_time',
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
          placeholder="Search for 'job title'"
          placeholderTextColor="#797979"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recommended' && styles.tabActive]}
          onPress={() => setActiveTab('recommended')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'recommended' && styles.tabTextActive,
            ]}
          >
            Recommended
          </Text>
          {activeTab === 'recommended' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'applied' && styles.tabActive]}
          onPress={() => setActiveTab('applied')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'applied' && styles.tabTextActive,
            ]}
          >
            Applied Jobs
          </Text>
          {activeTab === 'applied' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
          onPress={() => setActiveTab('saved')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'saved' && styles.tabTextActive,
            ]}
          >
            Saved Jobs
          </Text>
          {activeTab === 'saved' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Job Listings */}
      <ScrollView style={styles.jobsContainer} showsVerticalScrollIndicator={false}>
        {jobs.map((job) => (
          <TouchableOpacity key={job.id} style={styles.jobCard}>
            <View style={styles.jobCompanyLogo}>
              <Text style={styles.companyInitials}>{job.company}</Text>
            </View>
            <View style={styles.jobDetails}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobCompany}>{job.companyName}</Text>
              <Text style={styles.jobMeta}>
                {job.location} • full_time
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  tabText: {
    fontSize: 14,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#165DFC',
    fontWeight: '600',
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
    color: '#797979',
    marginBottom: 4,
    fontFamily: 'Geist-VariableFont_wght',
  },
  jobMeta: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
  },
});