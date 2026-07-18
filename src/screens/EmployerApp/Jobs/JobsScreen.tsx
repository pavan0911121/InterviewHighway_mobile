import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Modal, Alert } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Picker } from '@react-native-picker/picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useDispatch, useSelector } from 'react-redux'
import * as AsyncStore from "../../../AsyncStore";
import { getJobPostingStats, postCreateJob } from '../../../Redux/slices/jobPostings'
import { Briefcase, CheckCircle, CircleX, Clock, Currency, DollarSign, EllipsisVertical, Eye, FileText, MapPin, PauseCircle, Plus, Search, Users, X, ChevronRight, Home, ChevronLeft } from 'lucide-react-native'




const JobsScreen = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [jobFormData, setJobFormData] = useState({
    // Step 1
    title: '',
    location: '',
    is_remote: false,
    employment_type: '',
    experience_level: '',
    // Step 2
    description: '',
    requirements: '',
    responsibilities: '',
    // Step 3
    salary_min: '',
    salary_max: '',
    currency: 'INR',
    benefits: '',
    application_deadline: '',
    // Step 4 & 5
    requires_video_intro: 'required',
    status: 'draft',
    userId: null as string | null
  });
  const navigation = useNavigation()
  const dispatch = useDispatch();

  //get user data from async storage and set it to state
  const LocalStorageaData = async () => {
    try {
      const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);
      if (userLoggedInData) {
        const parsedUserData = JSON.parse(userLoggedInData);
        const userId = parsedUserData?.id;
        if(userId){
          setUserId(userId);
        }
        const response = await dispatch(getJobPostingStats(userId) as any);

      }
    } catch (error) {
      console.log("Error fetching user data from AsyncStorage:", error);
    }
  }

  // Fetch user data on component mount
  useEffect(() => {
    LocalStorageaData();
  }, [])

  // Update jobFormData when userId changes
  useEffect(() => {
    if (userId) {
      setJobFormData((prevData) => ({
        ...prevData,
        userId: userId
      }));
    }
  }, [userId])

  const selector = useSelector((state: any) => state.jobPostings);
  const dashboardSelector = useSelector((state: any) => state.employerDashboard);
  const selectorData = selector?.data?.jobs;
  const isLoading = selector?.loading;

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
  const isNextButtonDisabled = () => {
    if (currentStep === 1) {
      return !(jobFormData.title && jobFormData.location && jobFormData.employment_type && jobFormData.experience_level);
    } else if (currentStep === 2) {
      return !jobFormData.description;
    } else if (currentStep === 3) {
      return false; // Step 3 (Compensation) is optional
    } else if (currentStep === 4) {
      return false; // Step 4 is optional
    }
    return false;
  };

  const handleNextButton = () => {
    if (isNextButtonDisabled()) {
      Alert.alert("Please fill in all required fields before proceeding to the next step.");
      return;
    }
    setCurrentStep(currentStep + 1);
  };
const handleSaveDraft = () => {
  // Validate required fields for steps 1 and 2
 const body = jobFormData
 dispatch(postCreateJob(body) as any);
 setModalVisible(false) // Debugging line to check the state of jobFormData
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
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Job Postings</Text>
            <Text style={styles.subtitle}>Manage your job listings and applications</Text>
          </View>

          {/* Create Job Button */}
          <TouchableOpacity
            style={styles.createJobButton}
            onPress={() => setModalVisible(true)}
          >
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

      {/* Create Job Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                <Text style={styles.modalTitle}>Create New Job</Text>
                <Text style={styles.modalStep}>Step {currentStep} of 5</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color={'#000'} size={24} />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              {[1, 2, 3, 4, 5].map((step) => (
                <View
                  key={step}
                  style={[
                    styles.progressBar,
                    step <= currentStep ? styles.progressBarActive : styles.progressBarInactive,
                  ]}
                />
              ))}
            </View>

            {/* Modal Content */}
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {currentStep === 1 && (
                <View>
                  {/* Section Icon and Title */}
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon}>
                      <Briefcase color={'#165DFC'} size={24} />
                    </View>
                    <View>
                      <Text style={styles.sectionTitle}>Basic Information</Text>
                      <Text style={styles.sectionSubtitle}>Tell us about the position</Text>
                    </View>
                  </View>

                  {/* Job Title Field */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>
                      Job Title <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Senior Frontend Developer"
                      placeholderTextColor="#ccc"
                      value={jobFormData.title}
                      onChangeText={(text) =>
                        setJobFormData({ ...jobFormData, title: text.slice(0, 100) })
                      }
                      maxLength={100}
                    />
                    <Text style={styles.charCount}>
                      {jobFormData.title.length}/100 characters
                    </Text>
                  </View>

                  {/* Location Field */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>
                      Location <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Bangalore, Karnataka"
                      placeholderTextColor="#ccc"
                      value={jobFormData.location}
                      onChangeText={(text) =>
                        setJobFormData({ ...jobFormData, location: text })
                      }
                    />
                  </View>

                  {/* Remote Work Toggle */}
                  <View style={styles.formGroup}>
                    <View style={styles.toggleContainer}>
                      <Text style={styles.label}>Remote Work</Text>
                      <TouchableOpacity
                        style={[
                          styles.toggle,
                          jobFormData.is_remote ? styles.toggleActive : styles.toggleInactive,
                        ]}
                        onPress={() =>
                          setJobFormData({ ...jobFormData, is_remote: !jobFormData.is_remote })
                        }
                      >
                        <View
                          style={[
                            styles.toggleCircle,
                            jobFormData.is_remote ? styles.toggleCircleActive : styles.toggleCircleInactive,
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.toggleLabel}>Allow remote work for this position</Text>
                  </View>

                  {/* Employment Type Dropdown */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>
                      Employment Type <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={jobFormData.employment_type}
                        onValueChange={(value) => setJobFormData({ ...jobFormData, employment_type: value })}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                      >
                        <Picker.Item label="Select employment type" value="" />
                        <Picker.Item label="Fulltime" value="fulltime" />
                        <Picker.Item label="Parttime" value="parttime" />
                        <Picker.Item label="Contract" value="contract" />
                        <Picker.Item label="Internship" value="internship" />
                      </Picker>
                    </View>
                  </View>

                  {/* Experience Level Dropdown */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>
                      Experience Level <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={jobFormData.experience_level}
                        onValueChange={(value) => setJobFormData({ ...jobFormData, experience_level: value })}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                      >
                        <Picker.Item label="Select experience level" value="" />
                        <Picker.Item label="Entry level (0-2 years)" value="Entry level (0-2 years)" />
                        <Picker.Item label="Mid level (3-5 years)" value="Mid level (3-5 years)" />
                        <Picker.Item label="Senior level (6-10 years)" value="Senior level (6-10 years)" />
                        <Picker.Item label="Lead/Principal (10+ years)" value="Lead/Principal (10+ years)" />
                      </Picker>
                    </View>
                  </View>
                </View>
              )}

              {currentStep === 2 && (
                <View>
                  {/* Section Icon and Title */}
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon}>
                      <FileText color={'#165DFC'} size={24} />
                    </View>
                    <View>
                      <Text style={styles.sectionTitle}>Job Details</Text>
                      <Text style={styles.sectionSubtitle}>Provide detailed information about the role</Text>
                    </View>
                  </View>

                  {/* Job Description Field */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>
                      Job Description <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                      placeholderTextColor="#ccc"
                      multiline
                      numberOfLines={4}
                      value={jobFormData.description}
                      onChangeText={(text) =>
                        setJobFormData({ ...jobFormData, description: text })
                      }
                    />
                    <Text style={styles.charCount}>
                      {jobFormData.description.split(/\s+/).filter(w => w.length > 0).length} words (minimum 25 words required)
                    </Text>
                  </View>

                  {/* Requirements Field */}
                  <View style={styles.formGroup}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Requirements</Text>
                      <Text style={styles.optional}>(Optional)</Text>
                    </View>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="List the required skills, qualifications, and experience needed for this role..."
                      placeholderTextColor="#ccc"
                      multiline
                      numberOfLines={4}
                      value={jobFormData.requirements}
                      onChangeText={(text) =>
                        setJobFormData({ ...jobFormData, requirements: text })
                      }
                    />
                    <Text style={styles.helperText}>Include technical skills, certifications, education requirements, etc.</Text>
                  </View>

                  {/* Key Responsibilities Field */}
                  <View style={styles.formGroup}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Key Responsibilities</Text>
                      <Text style={styles.optional}>(Optional)</Text>
                    </View>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Outline the day-to-day responsibilities and key duties of this role..."
                      placeholderTextColor="#ccc"
                      multiline
                      numberOfLines={4}
                      value={jobFormData.responsibilities}
                      onChangeText={(text) =>
                        setJobFormData({ ...jobFormData, responsibilities: text })
                      }
                    />
                    <Text style={styles.helperText}>Describe what the candidate will be doing on a daily basis</Text>
                  </View>
                </View>
              )}

              {currentStep === 3 && (
                <View>
                  {/* Section Icon and Title */}
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon}>
                      <DollarSign color={'#165DFC'} size={24} />
                    </View>
                    <View>
                      <Text style={styles.sectionTitle}>Compensation & Benefits</Text>
                      <Text style={styles.sectionSubtitle}>Define salary range and benefits</Text>
                    </View>
                  </View>

                  {/* Minimum Salary Field */}
                  <View style={styles.formGroup}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Minimum Salary</Text>
                      <Text style={styles.optional}>(Optional)</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 800000"
                      placeholderTextColor="#ccc"
                      keyboardType="numeric"
                      value={jobFormData.salary_min}
                      onChangeText={(text) =>
                        setJobFormData({ ...jobFormData, salary_min: text })
                      }
                    />
                    <Text style={styles.helperText}>Annual salary in INR</Text>
                  </View>

                  {/* Maximum Salary Field */}
                  <View style={styles.formGroup}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Maximum Salary</Text>
                      <Text style={styles.optional}>(Optional)</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 1200000"
                      placeholderTextColor="#ccc"
                      keyboardType="numeric"
                      value={jobFormData.salary_max}
                      onChangeText={(text) =>
                        setJobFormData({ ...jobFormData, salary_max: text })
                      }
                    />
                    <Text style={styles.helperText}>Annual salary in INR</Text>
                  </View>

                  {/* Currency Dropdown */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Currency</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={jobFormData.currency}
                        onValueChange={(value) => setJobFormData({ ...jobFormData, currency: value })}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                      >
                        <Picker.Item label="INR (₹) - Indian Rupee" value="INR" />
                        <Picker.Item label="USD ($) - US Dollar" value="USD" />
                        <Picker.Item label="EUR (€) - Euro" value="EUR" />
                        <Picker.Item label="GBP (£) - British Pound" value="GBP" />
                      </Picker>
                    </View>
                    <Text style={styles.helperText}>Default: INR (Indian Rupee)</Text>
                  </View>

                  {/* Benefits & Perks Field */}
                  <View style={styles.formGroup}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Benefits & Perks</Text>
                      <Text style={styles.optional}>(Optional)</Text>
                    </View>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="List the benefits and perks offered with this position (e.g., health insurance, flexible hours, remote work, training budget, etc.)"
                      placeholderTextColor="#ccc"
                      multiline
                      numberOfLines={4}
                      value={jobFormData.benefits}
                      onChangeText={(text) =>
                        setJobFormData({ ...jobFormData, benefits: text })
                      }
                    />
                    <Text style={styles.helperText}>Include health insurance, equity, bonuses, time off, etc.</Text>
                  </View>

                  {/* Application Deadline Field */}
                  <View style={styles.formGroup}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Application Deadline</Text>
                      <Text style={styles.optional}>(Optional)</Text>
                    </View>
                    <View style={styles.dateInputContainer}>
                      <TextInput
                        style={styles.dateInput}
                        placeholder="dd/mm/yyyy"
                        placeholderTextColor="#ccc"
                        value={jobFormData.application_deadline}
                        onChangeText={(text) =>
                          setJobFormData({ ...jobFormData, application_deadline: text })
                        }
                      />
                      <MaterialCommunityIcons name="calendar" size={20} color="#999" style={styles.calendarIcon} />
                    </View>
                    <Text style={styles.helperText}>Last date to accept applications for this position</Text>
                  </View>
                </View>
              )}

              {currentStep === 4 && (
                <View>
                  {/* Section Icon and Title */}
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon}>
                      <Eye color={'#165DFC'} size={24} />
                    </View>
                    <View>
                      <Text style={styles.sectionTitle}>Review & Prepare</Text>
                      <Text style={styles.sectionSubtitle}>Review your job posting before final preview</Text>
                    </View>
                  </View>

                  {/* Required Courses Info */}
                  <View style={styles.infoBox}>
                    <View style={styles.infoIconContainer}>
                      <Text style={styles.infoIcon}>📚</Text>
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoTitle}>Required Courses (Coming Soon)</Text>
                      <Text style={styles.infoText}>Soon you'll be able to specify required courses that candidates must complete before applying. This feature is for skill-to-jobs correlation system and will help ensure candidates have the necessary qualifications.</Text>
                    </View>
                  </View>

                  {/* Job Posting Summary */}
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryTitle}>Job Posting Summary</Text>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Position:</Text>
                      <Text style={styles.summaryValue}>{jobFormData.title || 'Not provided'}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Location:</Text>
                      <Text style={styles.summaryValue}>
                        {jobFormData.location || 'Not provided'}
                        {jobFormData.is_remote && ' (Remote Available)'}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Type:</Text>
                      <Text style={styles.summaryValue}>{jobFormData.employment_type || 'Not provided'}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Status:</Text>
                      <Text style={[styles.summaryValue, styles.draftStatus]}>Draft</Text>
                    </View>
                  </View>
                </View>
              )}

              {currentStep === 5 && (
                <View>
                  {/* Section Icon and Title */}
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIcon}>
                      <Eye color={'#165DFC'} size={24} />
                    </View>
                    <View>
                      <Text style={styles.sectionTitle}>Preview & Submit</Text>
                      <Text style={styles.sectionSubtitle}>Review your job posting before publishing</Text>
                    </View>
                  </View>

                  {/* Basic Information Section */}
                  <View style={styles.previewSection}>
                    <View style={styles.previewSectionHeader}>
                      <Text style={styles.previewSectionTitle}>Basic Information</Text>
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="pencil" size={18} color="#165DFC" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Job Title:</Text>
                      <Text style={styles.previewValue}>{jobFormData.title || 'Not provided'}</Text>
                    </View>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Location:</Text>
                      <Text style={styles.previewValue}>
                        {jobFormData.location || 'Not provided'}
                        {jobFormData.is_remote && '\n(Remote Available)'}
                      </Text>
                    </View>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Employment Type:</Text>
                      <Text style={styles.previewValue}>{jobFormData.employment_type || 'Not provided'}</Text>
                    </View>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Experience Level:</Text>
                      <Text style={styles.previewValue}>{jobFormData.experience_level || 'Not provided'}</Text>
                    </View>
                  </View>

                  {/* Job Details Section */}
                  <View style={styles.previewSection}>
                    <View style={styles.previewSectionHeader}>
                      <Text style={styles.previewSectionTitle}>Job Details</Text>
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="pencil" size={18} color="#165DFC" />
                      </TouchableOpacity>
                    </View>
                    {jobFormData.description && (
                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Description:</Text>
                        <Text style={styles.previewValue}>{jobFormData.description}</Text>
                      </View>
                    )}
                    {jobFormData.requirements && (
                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Requirements:</Text>
                        <Text style={styles.previewValue}>{jobFormData.requirements}</Text>
                      </View>
                    )}
                    {jobFormData.responsibilities && (
                      <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Responsibilities:</Text>
                        <Text style={styles.previewValue}>{jobFormData.responsibilities}</Text>
                      </View>
                    )}
                  </View>

                  {/* Compensation & Benefits Section */}
                  <View style={styles.previewSection}>
                    <View style={styles.previewSectionHeader}>
                      <Text style={styles.previewSectionTitle}>Compensation & Benefits</Text>
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="pencil" size={18} color="#165DFC" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Salary Range:</Text>
                      <Text style={styles.previewValue}>
                        {jobFormData.salary_min && jobFormData.salary_max
                          ? `${jobFormData.currency} ${jobFormData.salary_min} - ${jobFormData.salary_max}`
                          : 'Not specified'}
                      </Text>
                    </View>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Benefits:</Text>
                      <Text style={styles.previewValue}>{jobFormData.benefits || 'Not specified'}</Text>
                    </View>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Deadline:</Text>
                      <Text style={styles.previewValue}>{jobFormData.application_deadline || 'Not specified'}</Text>
                    </View>
                  </View>

                  {/* Additional Settings Section */}
                  <View style={styles.previewSection}>
                    <View style={styles.previewSectionHeader}>
                      <Text style={styles.previewSectionTitle}>Additional Settings</Text>
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="pencil" size={18} color="#165DFC" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Video Introduction:</Text>
                      <Text style={styles.previewValue}>Required</Text>
                    </View>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Job Status:</Text>
                      <Text style={[styles.previewValue, styles.draftStatus]}>Will be saved as Draft</Text>
                    </View>
                  </View>

                  {/* Ready to Save */}
                  <View style={styles.readyBox}>
                    <View style={styles.readyCheckIcon}>
                      <CheckCircle color={'#00C853'} size={20} />
                    </View>
                    <View>
                      <Text style={styles.readyTitle}>Ready to save your job posting?</Text>
                      <Text style={styles.readyText}>Your job will be saved as a draft and you can publish it later from the jobs list.</Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Modal Footer - Buttons */}
            <View style={styles.modalFooter}>
              {currentStep > 1 && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setCurrentStep(currentStep - 1)}
                >
                  <ChevronLeft color={'#000000'} size={20} />
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}
              {currentStep < 5 ? (
                <TouchableOpacity
                  style={[
                    styles.nextButton,
                    currentStep === 1 && { marginLeft: 'auto' },
                    isNextButtonDisabled() && styles.nextButtonDisabled,
                  ]}
                  onPress={() => handleNextButton()}
                  disabled={isNextButtonDisabled()}
                >
                  <Text style={[styles.nextButtonText, isNextButtonDisabled() && styles.nextButtonTextDisabled]}>Next</Text>
                  <ChevronRight color={isNextButtonDisabled() ? '#999' : '#fff'} size={20} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.saveButton, { marginLeft: 'auto' }]}
                  onPress={() => {
                    handleSaveDraft()
                  }}
                >
                  <CheckCircle color={'#fff'} size={20} />
                  <Text style={styles.saveButtonText}>Save as Draft</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  modalStep: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    flex: 1,
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: '#165DFC',
  },
  progressBarInactive: {
    backgroundColor: '#E5E5E5',
  },
  modalContent: {
    paddingHorizontal: 20,
    marginBottom: 20,
    maxHeight: '60%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EBF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
    fontFamily: 'Geist-VariableFont_wght',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    backgroundColor: '#fff',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 6,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#165DFC',
  },
  toggleInactive: {
    backgroundColor: '#E5E5E5',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  toggleCircleActive: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  toggleCircleInactive: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    backgroundColor: '#fff',
  },
  pickerItem: {
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  nextButtonDisabled: {
    backgroundColor: '#D3D3D3',
    opacity: 0.7,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
  nextButtonTextDisabled: {
    color: '#666',
  },
  textArea: {
    minHeight: 100,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  optional: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 6,
  },
  dateInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dateInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  calendarIcon: {
    paddingRight: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EBF0FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoIconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  infoIcon: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 18,
  },
  summaryBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
  },
  draftStatus: {
    color: '#00C853',
  },
  previewSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  previewSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  previewSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  previewRow: {
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 13,
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
    lineHeight: 18,
  },
  readyBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F5FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D5E5FF',
  },
  readyCheckIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  readyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  readyText: {
    fontSize: 12,
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 16,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#165DFC',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
})