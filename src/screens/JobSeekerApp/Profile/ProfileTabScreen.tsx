import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { JobSeekerBottomTabParamList } from '../../../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Award, BookText, BriefcaseBusiness, Building2, Calendar, Camera, Clock, CodeXml, Download, Eye, FileText, Globe, GraduationCap, HardDriveUpload, Hourglass, Info, Lightbulb, Link, MapPin, Save, Shield, SquarePen, Star, StarOff, Trash2, Upload, User, UserRound, UserRoundPen, Video as VideoIcon, VideoOff, X } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import UploadVideo from '../../components/UploadVideo';
import * as AsyncStore from "../../../AsyncStore";
import { addEducation, addSkill, deleteSkill, getAllSkills, getEducation, getPersonalData, getProfileData, getResumes, getUserSkills, getVideoData, getWorkExperience, updateBio } from '../../../Redux/slices/profileSlice';
import Video from 'react-native-video';

type Props = BottomTabScreenProps<JobSeekerBottomTabParamList, 'ProfileTab'>;

const PROFICIENCY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
// Maps proficiency label to the numeric level expected by the addSkill API
const PROFICIENCY_LEVEL_MAP: Record<string, number> = {
  Basic: 1,
  Beginner: 2,
  Intermediate: 3,
  Advanced: 4,
  Expert: 5,
};
// Reverse lookup to turn a numeric proficiency level back into its label
const PROFICIENCY_LABEL_BY_LEVEL: Record<number, string> = Object.fromEntries(
  Object.entries(PROFICIENCY_LEVEL_MAP).map(([label, level]) => [level, label])
);
const BIO_MAX_LENGTH = 1000;
const EMPLOYMENT_TYPE_OPTIONS = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
const DEGREE_OPTIONS = [
  "Bachelor's Degree",
  "Master's Degree",
  'Doctoral Degree (PhD)',
  'Associate Degree',
  'Diploma',
  'Certificate',
  'Professional Degree',
  'High School Diploma',
  'Other',
];

const formatEmploymentType = (type: string) => {
  if (!type) { return ''; }
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatMonthYear = (dateStr?: string | null) => {
  if (!dateStr) { return ''; }
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) { return ''; }
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const getExperienceDuration = (startDate?: string | null, endDate?: string | null, isCurrent?: boolean) => {
  if (!startDate) { return ''; }
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) { return ''; }
  const end = isCurrent || !endDate ? new Date() : new Date(endDate);
  let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (totalMonths < 0) { totalMonths = 0; }
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) { parts.push(`${years} ${years === 1 ? 'year' : 'years'}`); }
  if (months > 0 || years === 0) { parts.push(`${months} ${months === 1 ? 'month' : 'months'}`); }
  return parts.join(', ');
};

const formatFileSize = (bytes?: number | null) => {
  if (bytes == null || Number.isNaN(bytes)) { return ''; }
  if (bytes < 1024) { return `${bytes} B`; }
  const kb = bytes / 1024;
  if (kb < 1024) { return `${kb.toFixed(2)} KB`; }
  return `${(kb / 1024).toFixed(2)} MB`;
};

const formatRelativeTime = (dateStr?: string | null) => {
  if (!dateStr) { return ''; }
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) { return ''; }
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) { return 'today'; }
  if (diffDays === 1) { return '1 day ago'; }
  if (diffDays < 30) { return `${diffDays} days ago`; }
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) { return 'over a month ago'; }
  if (diffMonths < 12) { return `${diffMonths} months ago`; }
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
};

export default function ProfileTabScreen({ navigation }: Props) {
  const [videoTitle, setVideoTitle] = useState('');
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    current_role: '',
  });
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [isEditingSocialLinks, setIsEditingSocialLinks] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [linkedinDraft, setLinkedinDraft] = useState('');
  const [websiteDraft, setWebsiteDraft] = useState('');
  const [isAddSkillModalVisible, setIsAddSkillModalVisible] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [addSkillTab, setAddSkillTab] = useState<'list' | 'custom'>('list');
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedSkillName, setSelectedSkillName] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState('Intermediate');
  const [yearsOfExperience, setYearsOfExperience] = useState('1');
  const [isExperienceModalVisible, setIsExperienceModalVisible] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [workExperienceItems, setWorkExperienceItems] = useState<any[]>([]);
  const [experienceForm, setExperienceForm] = useState({
    company_name: '',
    job_title: '',
    company_location: '',
    employment_type: 'full-time',
    is_current_job: false,
    start_date: '',
    end_date: '',
    job_description: '',
  });
  const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [educationForm, setEducationForm] = useState({
    institution_name: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    is_current: false,
    grade: '',
    description: '',
  });
  const [achievements, setAchievements] = useState<string[]>([]);
  const [achievementInput, setAchievementInput] = useState('');
  const dispatch = useDispatch();

  const selector = useSelector((state: any) => state.profile);
  useEffect(() => {
    fetchProfileData('All');
  }, []);

  const fetchProfileData = async (profile: string) => {
    try {
      console.log('Fetching profile data for profile:', profile);
      // Fetch user data from async storage
      const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);
      if (userLoggedInData) {
        const parsedUserData = JSON.parse(userLoggedInData);
        const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
        // const userId = parsedUserData?.id || null;
        if (userId) {
          const resultId = userId.replace(/"/g, '');
          if(profile === 'All') {
            dispatch(getAllSkills() as any);
            const response = await dispatch(getProfileData(resultId) as any);
            dispatch(getVideoData(resultId) as any);
            dispatch(getUserSkills({ userId: resultId }) as any);
            dispatch(getWorkExperience({ userId: resultId }) as any);
            dispatch(getEducation({ userId: resultId }) as any);
            dispatch(getResumes({ userId: resultId }) as any);
          }else if(profile === 'onlyProfile') {
            const response = await dispatch(getProfileData(resultId) as any);
          }
        }
      }

      // Dispatch profile action if needed
    } catch (error) {
      console.log('Error fetching profile data:', error);
    }
  };
  const userData = selector && selector?.data?.profile;
  const isLoading = selector?.isLoading;
  const allSkillsList = selector?.allSkills?.skills || [];
  const userSkillsList = selector?.userSkills?.userSkills || [];
  const videoData = selector?.videoData && (Array.isArray(selector.videoData) ? selector.videoData[0] : selector.videoData);
  const workExperienceList = selector?.workExperience?.workExperience || [];
  const hasVideo = !!videoData;
  const educationList = selector?.educationData?.education || [];
  const resumesList = selector?.resumes?.resumes || [];

  // useEffect(() => {
  //   setWorkExperienceItems(workExperienceList);
  // }, [workExperienceList]);

  const handleVideoTitleChange = (title: string) => {
    setVideoTitle(title);
    // You now have the title in the parent
  };

  const handleVideoUploadSuccess = async () => {
    // Refresh uploaded video info after a successful upload
    const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
    if (userId) {
      const resultId = userId.replace(/"/g, '');
      dispatch(getVideoData(resultId) as any);
    }
  };
  const handleEditPersonalDetails = () => {
    setPersonalForm({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      location: userData?.location || '',
      current_role: userData?.current_role || '',
    });
    setIsEditingPersonal(true);
  };

  const handleCancelPersonalDetails = () => {
    setIsEditingPersonal(false);
  };

  const handlePersonalFieldChange = (field: keyof typeof personalForm, value: string) => {
    setPersonalForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonalDetailsUpdate = async () => {
    try {
      const payload = { ...personalForm };
      const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
      if (userId) {
        const resultId = userId.replace(/"/g, '');
        await dispatch(getPersonalData({ userId: resultId, payload }) as any);
        await fetchProfileData('onlyProfile');
      }
      setIsEditingPersonal(false);
    }
    catch (error) {
      console.log('Error updating personal details:', error);
    }
  }

  const handleEditBio = () => {
    setBio(userData?.bio || '');
    setIsEditingBio(true);
  };

  const handleCancelBio = () => {
    setIsEditingBio(false);
  };

  const handleSaveBio = async () => {
    try {
      const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
      if (userId) {
        const resultId = userId.replace(/"/g, '');
        const response = dispatch(updateBio({ userId: resultId, payload: { bio: bio } }) as any);
        // console.log('Update bio response:', JSON.parse(response));
        fetchProfileData('onlyProfile');
      }
    } catch (error) {
      console.log('Error updating bio:', error);
    }
    setIsEditingBio(false);
  };

  const handleEditSocialLinks = () => {
    setLinkedinDraft(linkedinUrl);
    setWebsiteDraft(websiteUrl);
    setIsEditingSocialLinks(true);
  };

  const handleCancelSocialLinks = () => {
    setIsEditingSocialLinks(false);
  };

  const handleSaveSocialLinks = () => {
    setLinkedinUrl(linkedinDraft);
    setWebsiteUrl(websiteDraft);
    setIsEditingSocialLinks(false);
  };

  const handleOpenAddSkillModal = () => {
    setEditingSkillId(null);
    setAddSkillTab('list');
    setSelectedSkillId('');
    setSelectedSkillName('');
    setCustomSkillName('');
    setProficiencyLevel('Intermediate');
    setYearsOfExperience('1');
    setIsAddSkillModalVisible(true);
  };

  const handleOpenEditSkillModal = (item: any) => {
    const skillId = item?.skills?.id || item?.skill_id || item?.skillId || '';
    const rawLevel = item?.proficiency_level ?? item?.proficiencyLevel;
    const numericLevel = Number(rawLevel);
    const levelLabel = !Number.isNaN(numericLevel) && rawLevel !== null && rawLevel !== ''
      ? (PROFICIENCY_LABEL_BY_LEVEL[numericLevel] || 'Intermediate')
      : (typeof rawLevel === 'string' && PROFICIENCY_OPTIONS.includes(rawLevel) ? rawLevel : 'Intermediate');
    const years = item?.years_of_experience ?? item?.yearsOfExperience ?? item?.years;

    setEditingSkillId(skillId);
    setAddSkillTab('list');
    setSelectedSkillId(skillId);
    setSelectedSkillName(item?.skills?.name || '');
    setCustomSkillName('');
    setProficiencyLevel(levelLabel);
    setYearsOfExperience(years != null ? String(years) : '1');
    setIsAddSkillModalVisible(true);
  };
  const handleDeleteSkill = (skillId: string) => {
    Alert.alert(
      'Delete Skill',
      'Are you sure you want to delete this skill?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
              if (userId) {
                const resultId = userId.replace(/"/g, '');
                await dispatch(deleteSkill({ userId: resultId, skillId }) as any);
                dispatch(getUserSkills({ userId: resultId }) as any);
              }
            } catch (error) {
              console.log('Error deleting skill:', error);
            }
          },
        },
      ]
    );
  };

  const handleCloseAddSkillModal = () => {
    setEditingSkillId(null);
    setIsAddSkillModalVisible(false);
  };

  const handleAddSkill = async () => {
    const name = addSkillTab === 'list' ? selectedSkillName : customSkillName.trim();
    if (addSkillTab === 'list' ? !selectedSkillId : !name) {
      return;
    }
    try {
      const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
      if (userId) {
        const resultId = userId.replace(/"/g, '');
        const payload = {
          skillId: selectedSkillId,
          proficiencyLevel: PROFICIENCY_LEVEL_MAP[proficiencyLevel] || 1,
          yearsOfExperience: Number(yearsOfExperience) || 0,
        };
        await dispatch(addSkill({ userId: resultId, payload }) as any);
        dispatch(getUserSkills({ userId: resultId }) as any);
      }
      setEditingSkillId(null);
      setIsAddSkillModalVisible(false);
    } catch (error) {
      console.log('Error adding skill:', error);
    }
  };

  const handleOpenAddExperienceModal = () => {
    setEditingExperienceId(null);
    setExperienceForm({
      company_name: '',
      job_title: '',
      company_location: '',
      employment_type: 'full-time',
      is_current_job: false,
      start_date: '',
      end_date: '',
      job_description: '',
    });
    setIsExperienceModalVisible(true);
  };

  const handleOpenEditExperienceModal = (item: any) => {
    setEditingExperienceId(item?.id || null);
    setExperienceForm({
      company_name: item?.company_name || '',
      job_title: item?.job_title || '',
      company_location: item?.company_location || '',
      employment_type: item?.employment_type || 'full-time',
      is_current_job: !!item?.is_current_job,
      start_date: item?.start_date || '',
      end_date: item?.end_date || '',
      job_description: item?.job_description || '',
    });
    setIsExperienceModalVisible(true);
  };

  const handleCloseExperienceModal = () => {
    setEditingExperienceId(null);
    setIsExperienceModalVisible(false);
  };

  const handleExperienceFieldChange = (field: keyof typeof experienceForm, value: string | boolean) => {
    setExperienceForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveExperience = () => {
    if (!experienceForm.company_name.trim() || !experienceForm.job_title.trim()) {
      return;
    }
    if (editingExperienceId) {
      setWorkExperienceItems(prev => prev.map(item => (
        item.id === editingExperienceId ? { ...item, ...experienceForm } : item
      )));
    } else {
      setWorkExperienceItems(prev => [
        { id: `${Date.now()}`, ...experienceForm },
        ...prev,
      ]);
    }
    setEditingExperienceId(null);
    setIsExperienceModalVisible(false);
  };

  const handleDeleteExperience = (experienceId: string) => {
    Alert.alert(
      'Delete Experience',
      'Are you sure you want to delete this work experience?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setWorkExperienceItems(prev => prev.filter(item => item.id !== experienceId));
          },
        },
      ]
    );
  };

  const handleOpenAddEducationModal = () => {
    setEditingEducationId(null);
    setEducationForm({
      institution_name: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      is_current: false,
      grade: '',
      description: '',
    });
    setAchievements([]);
    setAchievementInput('');
    setIsEducationModalVisible(true);
  };

  const handleOpenEditEducationModal = (item: any) => {
    setEditingEducationId(item?.id || null);
    setEducationForm({
      institution_name: item?.institution_name || '',
      degree: item?.degree || '',
      field_of_study: item?.field_of_study || '',
      start_date: item?.start_date || '',
      end_date: item?.end_date || '',
      is_current: !!item?.is_current,
      grade: item?.grade || '',
      description: item?.description || '',
    });
    setAchievements(Array.isArray(item?.achievements) ? item.achievements : []);
    setAchievementInput('');
    setIsEducationModalVisible(true);
  };

  const handleCloseEducationModal = () => {
    setEditingEducationId(null);
    setIsEducationModalVisible(false);
  };

  const handleEducationFieldChange = (field: keyof typeof educationForm, value: string | boolean) => {
    setEducationForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAchievement = () => {
    const trimmed = achievementInput.trim();
    if (!trimmed) { return; }
    setAchievements(prev => [...prev, trimmed]);
    setAchievementInput('');
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveEducation = async () => {
    if (!educationForm.institution_name.trim() || !educationForm.degree.trim() || !educationForm.field_of_study.trim() || !educationForm.start_date.trim()) {
      return;
    }
    try {
      const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
      if (userId) {
        const resultId = userId.replace(/"/g, '');
        const payload = { ...educationForm, achievements };
        await dispatch(addEducation({ userId: resultId, payload }) as any);
        dispatch(getEducation({ userId: resultId }) as any);
      }
      setEditingEducationId(null);
      setIsEducationModalVisible(false);
    } catch (error) {
      console.log('Error adding education:', error);
    }
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
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.filterButton}>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#165DFC" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Profile Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>P</Text>
              <TouchableOpacity style={styles.cameraIcon}>
                <Camera size={12} color="#ffff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.uploadDescription}>
              Click the camera icon or drag & drop an image to upload your profile photo
            </Text>

            <Text style={styles.supportedFormats}>
              Supported formats: JPG, PNG, GIF • Max size: 5MB
            </Text>

            <TouchableOpacity style={styles.noVideoButton}>
              <VideoOff size={12} color="#ffff" fill={'#fff'} />
              <Text style={styles.noVideoButtonText}>No Video</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Name */}
          <Text style={styles.profileName}>{userData?.name}</Text>

          {/* Profile Title */}
          <Text style={styles.profileTitle}>{userData?.current_role}</Text>

          {/* Profile Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <MapPin fill={'#165DFC'} color={'white'} />
                <Text style={styles.statText}>{userData?.location || 'Location not set'}</Text>
              </View>
              <View style={styles.statItem}>
                <BriefcaseBusiness fill={'#165DFC'} color={'white'} />
                <Text style={styles.statText}>{userData?.experience_level || '0 years experience'}</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <View style={styles.greenDot} />
                <Text style={styles.statText}>Open to work</Text>
              </View>
              <View style={styles.statItem}>
                <Eye fill={'#165DFC'} color={'white'} />
                <Text style={styles.statText}>127 profile views</Text>
              </View>
            </View>
          </View>

          {/* Profile Strength Gauge Section */}
          <View style={styles.strengthSection}>
            <View style={styles.gaugeContainer}>
              <View style={styles.gaugeOuter}>
                <View style={styles.gaugeInner}>
                  <Text style={styles.gaugePercentage}>{userData?.profile_completion_percentage}%</Text>
                </View>
              </View>
            </View>

            <Text style={styles.strengthLabel}>Profile</Text>
            <Text style={styles.strengthLabel}>Strength</Text>

            <Text style={styles.strengthTitle}>Profile Strength</Text>

            <Text style={styles.strengthDescription}>
              Add more details to boost visibility
            </Text>

            <TouchableOpacity style={styles.completeProfileButton}>
              <Text style={styles.completeProfileButtonText}>Complete Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Video Introduction Section */}
          <View style={styles.videoSection}>
            <View style={styles.videoHeader}>
              <View style={styles.videoHeaderIcon}>
                <VideoIcon fill={'#165DFC'} color={'white'} />
              </View>
              <Text style={styles.videoHeaderTitle}>Video Introduction</Text>
            </View>
            <UploadVideo
              buttonLabel={hasVideo ? 'Re-Upload' : 'Upload Video'}
              modalTitle="Upload Video Introduction"
              onVideoTitleChange={handleVideoTitleChange}
              onUploadSuccess={handleVideoUploadSuccess}
              hasVideo={hasVideo}
            />
            {hasVideo && (
              <Video
                source={{ uri: selector?.videoData?.data?.video_url }}
                style={{ width: '100%', aspectRatio: 16 / 9 }}
                controls
              />
            )}
            {/* <TouchableOpacity style={styles.uploadVideoButton}>
              <HardDriveUpload fill={'#165DFC'} color={'#165DFC'} />
              <Text style={styles.uploadVideoText}>Upload Video</Text>
            </TouchableOpacity> */}

            <View style={styles.videoUploadBox}>
              <VideoIcon size={40} color="#6B7280" />
              <Text style={styles.noVideoText}>{hasVideo ? (videoData?.title || 'Video uploaded') : 'No video uploaded yet'}</Text>
              <Text style={styles.uploadVideoDescription}>{hasVideo ? 'Your video introduction is on file' : 'Upload a video introduction'}</Text>
            </View>

            <View style={styles.videoStatusContainer}>
              <Text style={styles.videoStatusTitle}>Video Status</Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, hasVideo && { backgroundColor: '#22C55E' }]} />
                <Text style={styles.statusText}>{hasVideo ? 'Uploaded' : 'Not uploaded'}</Text>
              </View>
            </View>

            <View style={styles.videoInfoBox}>
              <Info fill={'#165DFC'} color={'white'} />
              <Text style={styles.videoInfoText}>
                Upload a video introduction to showcase your personality to employers.
              </Text>
            </View>
          </View>

          {/* Personal Information Section */}
          <View style={styles.personalInfoSection}>
            <View style={styles.personalInfoHeader}>
              <View style={styles.personalInfoIcon}>
                <UserRound fill={'#165DFC'} color={'white'} />
              </View>
              <Text style={styles.personalInfoTitle}>Personal Information</Text>
            </View>

            {!isEditingPersonal && (
              <TouchableOpacity style={styles.editButton} onPress={handleEditPersonalDetails}>
                <SquarePen color={'#165DFC'} size={20} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}

            <View style={styles.infoField}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              {isEditingPersonal ? (
                <TextInput
                  style={styles.fieldInput}
                  value={personalForm.name}
                  onChangeText={(text) => handlePersonalFieldChange('name', text)}
                  placeholder="Full Name"
                />
              ) : (
                <Text style={styles.fieldValue}>{userData?.name || 'Not provided'}</Text>
              )}
            </View>

            <View style={styles.infoField}>
              <Text style={styles.fieldLabel}>Email</Text>
              {isEditingPersonal ? (
                <TextInput
                  style={styles.fieldInput}
                  value={personalForm.email}
                  onChangeText={(text) => handlePersonalFieldChange('email', text)}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.fieldValue}>{userData?.email || 'Not provided'}</Text>
              )}
            </View>

            <View style={styles.infoField}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              {isEditingPersonal ? (
                <TextInput
                  style={styles.fieldInput}
                  value={personalForm.phone}
                  onChangeText={(text) => handlePersonalFieldChange('phone', text)}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.fieldValue}>{userData?.phone || 'Not provided'}</Text>
              )}
            </View>

            <View style={styles.infoField}>
              <Text style={styles.fieldLabel}>Location</Text>
              {isEditingPersonal ? (
                <TextInput
                  style={styles.fieldInput}
                  value={personalForm.location}
                  onChangeText={(text) => handlePersonalFieldChange('location', text)}
                  placeholder="Location"
                />
              ) : (
                <Text style={styles.fieldValue}>{userData?.location || 'Not provided'}</Text>
              )}
            </View>
            <View style={styles.infoField}>
              <Text style={styles.fieldLabel}>Role</Text>
              {isEditingPersonal ? (
                <TextInput
                  style={styles.fieldInput}
                  value={personalForm.current_role}
                  onChangeText={(text) => handlePersonalFieldChange('current_role', text)}
                  placeholder="Role"
                />
              ) : (
                <Text style={styles.fieldValue}>{userData?.current_role || 'Not provided'}</Text>
              )}
            </View>

            {isEditingPersonal && (
              <View style={styles.personalEditActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPersonalDetails}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handlePersonalDetailsUpdate}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* About Me Section */}
          <View style={styles.aboutMeSection}>
            <View style={styles.aboutMeHeader}>
              <View style={styles.aboutMeIcon}>
                <FileText fill={'#9810FA'} color={'white'} />
              </View>
              <Text style={styles.aboutMeTitle}>About Me</Text>
            </View>

            {!isEditingBio && (
              <TouchableOpacity style={styles.aboutEditButton} onPress={handleEditBio}>
                <SquarePen color={'#9810FA'} size={20} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}

            {isEditingBio ? (
              <>
                <TextInput
                  style={styles.bioTextArea}
                  value={bio}
                  onChangeText={(text) => setBio(text.slice(0, BIO_MAX_LENGTH))}
                  placeholder="Write 2-3 sentences highlighting your professional background and key strengths"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  maxLength={BIO_MAX_LENGTH}
                />
                <View style={styles.bioModalFooterRow}>
                  <Text style={styles.bioHintText}>
                    Write 2-3 sentences highlighting your{'\n'}professional background and key strengths
                  </Text>
                  <Text style={styles.bioCounterText}>{bio.length}/{BIO_MAX_LENGTH}</Text>
                </View>
                <View style={styles.modalActionsRow}>
                  <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelBio}>
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.bioSaveButton} onPress={handleSaveBio}>
                    <Save color={'#FFFFFF'} size={16} />
                    <Text style={styles.modalSaveButtonText}>Save Bio</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : userData?.bio ? (
              <Text style={styles.fieldValue}>{userData?.bio}</Text>
            ) : (
              <View style={styles.bioBox}>
                <UserRoundPen fill={'#D1D5DC'} color={'white'} size={45} />
                <Text style={styles.noBioText}>No bio added yet</Text>
                <Text style={styles.bioDescription}>
                  Add a professional bio to help employers understand your background and expertise
                </Text>
              </View>
            )}

            <View style={styles.proTipBox}>
              <Lightbulb fill={'#FBBF24'} color={'white'} size={20} />
              <Text style={styles.proTipText}>
                A good bio includes your experience, skills, and career goals
              </Text>
            </View>
          </View>

          {/* Social Links Section */}
          <View style={styles.socialLinksSection}>
            <View style={styles.socialLinksHeader}>
              <View style={styles.socialLinksIcon}>
                <Link color={'#00A73F'} size={20} />
              </View>
              <Text style={styles.socialLinksTitle}>Social Links</Text>
            </View>

            {!isEditingSocialLinks && (
              <TouchableOpacity style={styles.aboutEditButton} onPress={handleEditSocialLinks}>
                <SquarePen color={'#00A63E'} size={20} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}

            {isEditingSocialLinks ? (
              <>
                <Text style={styles.fieldLabel}>LinkedIn Profile</Text>
                <TextInput
                  style={styles.socialInput}
                  value={linkedinDraft}
                  onChangeText={setLinkedinDraft}
                  placeholder="https://..."
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                />
                <Text style={styles.socialInputHint}>
                  Your LinkedIn profile helps employers learn more about your professional background
                </Text>

                <Text style={[styles.fieldLabel, styles.socialSecondFieldLabel]}>Personal Website/Portfolio</Text>
                <TextInput
                  style={styles.socialInput}
                  value={websiteDraft}
                  onChangeText={setWebsiteDraft}
                  placeholder="https://..."
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                />
                <Text style={styles.socialInputHint}>
                  Share your portfolio, blog, or personal website to showcase your work
                </Text>

                <View style={styles.modalActionsRow}>
                  <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelSocialLinks}>
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialSaveButton} onPress={handleSaveSocialLinks}>
                    <Save color={'#FFFFFF'} size={16} />
                    <Text style={styles.modalSaveButtonText}>Save Links</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.socialLinkItem}>
                  <View style={styles.linkedinIconBox}>
                    <Text style={styles.linkedinIcon}>in</Text>
                  </View>
                  <View style={styles.socialLinkContent}>
                    <Text style={styles.socialLinkLabel}>LinkedIn Profile</Text>
                    <Text style={styles.socialLinkValue}>{linkedinUrl || 'Not provided'}</Text>
                  </View>
                </View>

                <View style={styles.socialLinkItem}>
                  <View style={styles.websiteIconBox}>
                    <Globe fill={"#fff"} color={'#00A63E'} />
                  </View>
                  <View style={styles.socialLinkContent}>
                    <Text style={styles.socialLinkLabel}>Personal Website</Text>
                    <Text style={styles.socialLinkValue}>{websiteUrl || 'Not provided'}</Text>
                  </View>
                </View>
              </>
            )}

            <View style={styles.socialProTipBox}>
              <Text style={styles.socialProTipLabel}><Lightbulb fill={'#FBBF24'} color={'white'} size={20} /> Pro Tip:</Text>
              <Text style={styles.socialProTipText}>
                Complete your social links
              </Text>
              <Text style={styles.socialProTipDescription}>
                Adding your LinkedIn and portfolio links increases your profile strength and helps employers get a complete picture of your professional presence.
              </Text>
            </View>
          </View>

          {/* Skills Section */}
          <View style={styles.skillsSection}>
            <View style={styles.skillsHeader}>
              <Text style={styles.skillsTitle}>Skills</Text>
              <TouchableOpacity style={styles.addSkillButton} onPress={handleOpenAddSkillModal}>
                <Text style={styles.addSkillIcon}>+</Text>
                <Text style={styles.addSkillText}>Add Skill</Text>
              </TouchableOpacity>
            </View>

            {userSkillsList?.length > 0 ? (
              <View style={styles.userSkillsList}>
                {userSkillsList?.map((item: any, index: number) => {
                  const skillName = item?.skills?.name || 'Skill';
                  const rawLevel = item?.proficiency_level ?? item?.proficiencyLevel;
                  const numericLevel = Number(rawLevel);
                  const proficiencyLabel = !Number.isNaN(numericLevel) && rawLevel !== null && rawLevel !== ''
                    ? (PROFICIENCY_LABEL_BY_LEVEL[numericLevel] || '')
                    : (typeof rawLevel === 'string' ? rawLevel : '');
                  const years = item?.years_of_experience ?? item?.yearsOfExperience ?? item?.years;
                  const yearsLabel = years != null && years !== '' ? `${years} ${Number(years) === 1 ? 'year' : 'years'}` : '';
                  return (
                    <View key={item?.id || `${skillName}-${index}`} style={styles.userSkillCard}>
                      <View style={styles.userSkillCardTop}>
                        <Text style={styles.userSkillName}>{skillName}</Text>
                        <View style={styles.userSkillActions}>
                          <TouchableOpacity style={styles.userSkillActionButton} onPress={() => handleOpenEditSkillModal(item)}>
                            <SquarePen color={'#9810FA'} size={18} />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.userSkillActionButton} onPress={() => handleDeleteSkill(item?.id)}>
                            <Trash2 color={'#EF4444'} size={18} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.userSkillMetaRow}>
                        {!!proficiencyLabel && (
                          <View style={styles.userSkillMetaItem}>
                            <Star fill={'#9810FA'} color={'#9810FA'} size={14} />
                            <Text style={styles.userSkillMetaText}>{proficiencyLabel}</Text>
                          </View>
                        )}
                        {!!yearsLabel && (
                          <View style={styles.userSkillMetaItem}>
                            <Clock color={'#9810FA'} size={14} />
                            <Text style={styles.userSkillMetaText}>{yearsLabel}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptySkillsBox}>
                <CodeXml color={'#D1D5DC'} size={40} />
                <Text style={styles.emptySkillsText}>
                  No skills added yet. Add your technical skills to showcase your expertise.
                </Text>
              </View>
            )}
          </View>

          {/* Add Skill Modal */}
          <Modal
            visible={isAddSkillModalVisible}
            transparent
            animationType="fade"
            onRequestClose={handleCloseAddSkillModal}
          >
            <View style={styles.modalOverlay}>
              <TouchableOpacity style={styles.modalOverlayTouchable} activeOpacity={1} onPress={handleCloseAddSkillModal} />
              <View style={styles.skillModalCard}>
                <View style={styles.skillModalHeader}>
                  <Text style={styles.skillModalTitle}>{editingSkillId ? 'Edit Skill' : 'Add New Skill'}</Text>
                  <TouchableOpacity onPress={handleCloseAddSkillModal}>
                    <X color={'#797979'} size={22} />
                  </TouchableOpacity>
                </View>

                <View style={styles.skillTabsRow}>
                  <TouchableOpacity
                    style={[styles.skillTabButton, addSkillTab === 'list' && styles.skillTabButtonActive]}
                    onPress={() => setAddSkillTab('list')}
                  >
                    <Text style={[styles.skillTabButtonText, addSkillTab === 'list' && styles.skillTabButtonTextActive]}>
                      Select from list
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.skillTabButton, addSkillTab === 'custom' && styles.skillTabButtonActive]}
                    onPress={() => setAddSkillTab('custom')}
                  >
                    <Text style={[styles.skillTabButtonText, addSkillTab === 'custom' && styles.skillTabButtonTextActive]}>
                      Add custom skill
                    </Text>
                  </TouchableOpacity>
                </View>

                {addSkillTab === 'list' ? (
                  <>
                    <Text style={styles.skillFieldLabel}>Skill <Text style={styles.requiredAsterisk}>*</Text></Text>
                    <View style={styles.skillPickerWrapper}>
                      <Picker
                        selectedValue={selectedSkillId}
                        onValueChange={(value) => {
                          setSelectedSkillId(value);
                          const skill = allSkillsList.find((s: any) => s.id === value);
                          setSelectedSkillName(skill?.name || '');
                        }}
                        style={styles.skillPicker}
                      >
                        <Picker.Item label="Select a skill" value="" />
                        {allSkillsList.map((skill: any) => (
                          <Picker.Item key={skill.id} label={skill.name} value={skill.id} />
                        ))}
                      </Picker>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.skillFieldLabel}>Skill Name <Text style={styles.requiredAsterisk}>*</Text></Text>
                    <TextInput
                      style={styles.socialInput}
                      value={customSkillName}
                      onChangeText={setCustomSkillName}
                      placeholder="Enter skill name"
                      placeholderTextColor="#9CA3AF"
                    />
                  </>
                )}

                <Text style={styles.skillFieldLabel}>Proficiency Level <Text style={styles.requiredAsterisk}>*</Text></Text>
                <View style={styles.skillPickerWrapper}>
                  <Picker
                    selectedValue={proficiencyLevel}
                    onValueChange={(value) => setProficiencyLevel(value)}
                    style={styles.skillPicker}
                  >
                    {PROFICIENCY_OPTIONS.map((level) => (
                      <Picker.Item key={level} label={level} value={level} />
                    ))}
                  </Picker>
                </View>

                <Text style={styles.skillFieldLabel}>Years of Experience <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TextInput
                  style={styles.socialInput}
                  value={yearsOfExperience}
                  onChangeText={setYearsOfExperience}
                  placeholder="1"
                  keyboardType="numeric"
                />

                <View style={styles.modalActionsRow}>
                  <TouchableOpacity style={styles.modalCancelButton} onPress={handleCloseAddSkillModal}>
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.skillAddButton} onPress={handleAddSkill}>
                    <Text style={styles.modalSaveButtonText}>{editingSkillId ? 'Save Changes' : 'Add Skill'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Work Experience Section */}
          <View style={styles.workExperienceSection}>
            <View style={styles.experienceHeader}>
              <View style={styles.experienceIconBox}>
                <BriefcaseBusiness fill={'#F54800'} color={'#FFECD4'} size={20} />
              </View>
              <Text style={styles.experienceTitle}>Work Experience</Text>
            </View>

            <TouchableOpacity style={styles.addExperienceButton} onPress={handleOpenAddExperienceModal}>
              <Text style={styles.addExperienceIcon}>+</Text>
              <Text style={styles.addExperienceText}>Add Experience</Text>
            </TouchableOpacity>

            {workExperienceList?.length > 0 ? (
              <View style={styles.experienceTimelineList}>
                {workExperienceList.map((item: any, index: number) => {
                  const dateRangeLabel = `${formatMonthYear(item?.start_date)} - ${item?.is_current_job ? 'Present' : (formatMonthYear(item?.end_date) || 'Present')}`;
                  const durationLabel = getExperienceDuration(item?.start_date, item?.end_date, item?.is_current_job);
                  return (
                    <View key={item?.id || index} style={styles.experienceItemRow}>
                      <View style={styles.experienceTimelineColumn}>
                        <View style={styles.experienceTimelineIconCircle}>
                          <Building2 color={'#F97316'} size={20} />
                        </View>
                        {index !== workExperienceList.length - 1 && <View style={styles.experienceTimelineLine} />}
                      </View>
                      <View style={styles.experienceCard}>
                        <View style={styles.experienceCardHeader}>
                          <View style={styles.experienceCardTitleBox}>
                            <Text style={styles.experienceCardTitle}>{item?.job_title}</Text>
                            <Text style={styles.experienceCardCompany}>{item?.company_name}</Text>
                          </View>
                          <View style={styles.experienceCardActions}>
                            <TouchableOpacity style={styles.userSkillActionButton} onPress={() => handleOpenEditExperienceModal(item)}>
                              <SquarePen color={'#F97316'} size={18} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.userSkillActionButton} onPress={() => handleDeleteExperience(item?.id)}>
                              <Trash2 color={'#EF4444'} size={18} />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.experienceCardMetaRow}>
                          <Clock color={'#F97316'} size={14} />
                          <Text style={styles.experienceCardMetaText}>{dateRangeLabel}</Text>
                        </View>
                        <View style={styles.experienceCardMetaRow}>
                          <User color={'#F97316'} size={14} />
                          <Text style={styles.experienceCardMetaText}>{formatEmploymentType(item?.employment_type)}</Text>
                        </View>
                        {!!item?.company_location && (
                          <View style={styles.experienceCardMetaRow}>
                            <MapPin color={'#F97316'} size={14} />
                            <Text style={styles.experienceCardMetaText}>{item.company_location}</Text>
                          </View>
                        )}
                        {!!durationLabel && (
                          <View style={styles.experienceCardMetaRow}>
                            <Hourglass color={'#F97316'} size={14} />
                            <Text style={styles.experienceCardMetaText}>{durationLabel}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ) 
            : 
            (
              <View style={styles.emptyExperienceBox}>
                <BriefcaseBusiness color={'#D1D5DC'} size={40} />
                <Text style={styles.emptyExperienceText}>
                  No work experience added yet. Add your professional experience to showcase your career journey.
                </Text>
              </View>
            )}
          </View>

          {/* Add/Edit Experience Modal */}
          <Modal
            visible={isExperienceModalVisible}
            transparent
            animationType="fade"
            onRequestClose={handleCloseExperienceModal}
          >
            <View style={styles.modalOverlay}>
              <TouchableOpacity style={styles.modalOverlayTouchable} activeOpacity={1} onPress={handleCloseExperienceModal} />
              <ScrollView style={styles.experienceModalCard} contentContainerStyle={styles.experienceModalCardContent}>
                <View style={styles.skillModalHeader}>
                  <Text style={styles.skillModalTitle}>{editingExperienceId ? 'Edit Experience' : 'Add Work Experience'}</Text>
                  <TouchableOpacity onPress={handleCloseExperienceModal}>
                    <X color={'#797979'} size={22} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.skillFieldLabel}>Company Name <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TextInput
                  style={styles.socialInput}
                  value={experienceForm.company_name}
                  onChangeText={(text) => handleExperienceFieldChange('company_name', text)}
                  placeholder="Enter company name"
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.skillFieldLabel}>Job Title <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TextInput
                  style={styles.socialInput}
                  value={experienceForm.job_title}
                  onChangeText={(text) => handleExperienceFieldChange('job_title', text)}
                  placeholder="Enter job title"
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.skillFieldLabel}>Location</Text>
                <TextInput
                  style={styles.socialInput}
                  value={experienceForm.company_location}
                  onChangeText={(text) => handleExperienceFieldChange('company_location', text)}
                  placeholder="City, Country"
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.skillFieldLabel}>Employment Type</Text>
                <View style={styles.skillPickerWrapper}>
                  <Picker
                    selectedValue={experienceForm.employment_type}
                    onValueChange={(value) => handleExperienceFieldChange('employment_type', value)}
                    style={styles.skillPicker}
                  >
                    {EMPLOYMENT_TYPE_OPTIONS.map((type) => (
                      <Picker.Item key={type} label={formatEmploymentType(type)} value={type} />
                    ))}
                  </Picker>
                </View>

                <TouchableOpacity
                  style={styles.currentJobToggleRow}
                  onPress={() => handleExperienceFieldChange('is_current_job', !experienceForm.is_current_job)}
                >
                  <View style={experienceForm.is_current_job ? styles.checkedBox : styles.uncheckedBox}>
                    {experienceForm.is_current_job && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.skillFieldLabel}>I currently work here</Text>
                </TouchableOpacity>

                <Text style={styles.skillFieldLabel}>Start Date <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TextInput
                  style={styles.socialInput}
                  value={experienceForm.start_date}
                  onChangeText={(text) => handleExperienceFieldChange('start_date', text)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />

                {!experienceForm.is_current_job && (
                  <>
                    <Text style={styles.skillFieldLabel}>End Date</Text>
                    <TextInput
                      style={styles.socialInput}
                      value={experienceForm.end_date}
                      onChangeText={(text) => handleExperienceFieldChange('end_date', text)}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#9CA3AF"
                    />
                  </>
                )}

                <Text style={styles.skillFieldLabel}>Job Description</Text>
                <TextInput
                  style={styles.bioTextArea}
                  value={experienceForm.job_description}
                  onChangeText={(text) => handleExperienceFieldChange('job_description', text)}
                  placeholder="Describe your responsibilities and achievements"
                  placeholderTextColor="#9CA3AF"
                  multiline
                />

                <View style={styles.modalActionsRow}>
                  <TouchableOpacity style={styles.modalCancelButton} onPress={handleCloseExperienceModal}>
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.experienceSaveButton} onPress={handleSaveExperience}>
                    <Text style={styles.modalSaveButtonText}>{editingExperienceId ? 'Save Changes' : 'Add Experience'}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>

          {/* Education Section */}
          <View style={styles.educationSection}>
            <View style={styles.educationHeader}>
              <View style={styles.educationIconBox}>
                <GraduationCap color={'#165DFC'} size={20} />
              </View>
              <Text style={styles.educationTitle}>Education</Text>
              <TouchableOpacity style={styles.addEducationButton} onPress={handleOpenAddEducationModal}>
                <Text style={styles.addEducationIcon}>+</Text>
                <Text style={styles.addEducationText}>Add</Text>
              </TouchableOpacity>
            </View>

            {educationList?.length > 0 ? (
              <View style={styles.educationTimelineList}>
                {educationList.map((item: any, index: number) => {
                  const titleLabel = item?.field_of_study
                    ? `${item?.degree || ''} in ${item?.field_of_study}`
                    : (item?.degree || '');
                  const dateRangeLabel = `${formatMonthYear(item?.start_date)} - ${item?.is_current ? 'Present' : (formatMonthYear(item?.end_date) || 'Present')}`;
                  const durationLabel = getExperienceDuration(item?.start_date, item?.end_date, item?.is_current);
                  return (
                    <View key={item?.id || index} style={styles.educationItemRow}>
                      <View style={styles.educationTimelineColumn}>
                        <View style={styles.educationTimelineDot} />
                        {index !== educationList.length - 1 && <View style={styles.educationTimelineLine} />}
                      </View>
                      <View style={styles.educationCard}>
                        <View style={styles.educationCardHeader}>
                          <View style={styles.educationCardTitleBox}>
                            <Text style={styles.educationCardTitle}>{titleLabel}</Text>
                            <Text style={styles.educationCardSubtitle}>{item?.institution_name}</Text>
                          </View>
                          <View style={styles.educationCardActions}>
                            <TouchableOpacity style={styles.userSkillActionButton} onPress={() => handleOpenEditEducationModal(item)}>
                              <SquarePen color={'#165DFC'} size={18} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.userSkillActionButton}>
                              <Trash2 color={'#EF4444'} size={18} />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.educationCardMetaRow}>
                          <Clock color={'#797979'} size={14} />
                          <Text style={styles.educationCardMetaText}>{dateRangeLabel}</Text>
                          {!!durationLabel && (
                            <>
                              <Text style={styles.educationCardMetaDot}>·</Text>
                              <Text style={styles.educationCardMetaText}>{durationLabel}</Text>
                            </>
                          )}
                        </View>
                        {!!item?.grade && (
                          <View style={styles.educationCardMetaRow}>
                            <Award color={'#797979'} size={14} />
                            <Text style={styles.educationCardMetaText}>{item.grade}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyEducationBox}>
                <GraduationCap color={'#D1D5DC'} size={40} />
                <Text style={styles.noEducationText}>No education added yet</Text>
                <TouchableOpacity style={styles.addFirstEducationButton} onPress={handleOpenAddEducationModal}>
                  <Text style={styles.addFirstEducationIcon}>+</Text>
                  <Text style={styles.addFirstEducationText}>Add Your First Education</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Add/Edit Education Modal */}
          <Modal
            visible={isEducationModalVisible}
            transparent
            animationType="fade"
            onRequestClose={handleCloseEducationModal}
          >
            <View style={styles.modalOverlay}>
              <TouchableOpacity style={styles.modalOverlayTouchable} activeOpacity={1} onPress={handleCloseEducationModal} />
              <ScrollView style={styles.experienceModalCard} contentContainerStyle={styles.experienceModalCardContent}>
                <View style={styles.skillModalHeader}>
                  <Text style={styles.skillModalTitle}>{editingEducationId ? 'Edit Education' : 'Add Education'}</Text>
                  <TouchableOpacity onPress={handleCloseEducationModal}>
                    <X color={'#797979'} size={22} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.skillFieldLabel}>Institution Name <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TextInput
                  style={styles.socialInput}
                  value={educationForm.institution_name}
                  onChangeText={(text) => handleEducationFieldChange('institution_name', text)}
                  placeholder="e.g., Stanford University"
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.skillFieldLabel}>Degree <Text style={styles.requiredAsterisk}>*</Text></Text>
                <View style={styles.skillPickerWrapper}>
                  <Picker
                    selectedValue={educationForm.degree}
                    onValueChange={(value) => handleEducationFieldChange('degree', value)}
                    style={styles.skillPicker}
                  >
                    <Picker.Item label="Select a degree" value="" />
                    {DEGREE_OPTIONS.map((degree) => (
                      <Picker.Item key={degree} label={degree} value={degree} />
                    ))}
                  </Picker>
                </View>

                <Text style={styles.skillFieldLabel}>Field of Study <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TextInput
                  style={styles.socialInput}
                  value={educationForm.field_of_study}
                  onChangeText={(text) => handleEducationFieldChange('field_of_study', text)}
                  placeholder="e.g., Computer Science"
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.skillFieldLabel}>Start Date <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TextInput
                  style={styles.socialInput}
                  value={educationForm.start_date}
                  onChangeText={(text) => handleEducationFieldChange('start_date', text)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />

                {!educationForm.is_current && (
                  <>
                    <Text style={styles.skillFieldLabel}>End Date</Text>
                    <TextInput
                      style={styles.socialInput}
                      value={educationForm.end_date}
                      onChangeText={(text) => handleEducationFieldChange('end_date', text)}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#9CA3AF"
                    />
                  </>
                )}

                <TouchableOpacity
                  style={styles.currentJobToggleRow}
                  onPress={() => handleEducationFieldChange('is_current', !educationForm.is_current)}
                >
                  <View style={educationForm.is_current ? styles.checkedBox : styles.uncheckedBox}>
                    {educationForm.is_current && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.skillFieldLabel}>I am currently studying here</Text>
                </TouchableOpacity>

                <Text style={styles.skillFieldLabel}>Grade / GPA (Optional)</Text>
                <TextInput
                  style={styles.socialInput}
                  value={educationForm.grade}
                  onChangeText={(text) => handleEducationFieldChange('grade', text)}
                  placeholder="e.g., 3.8 GPA or First Class"
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.skillFieldLabel}>Description (Optional)</Text>
                <TextInput
                  style={styles.bioTextArea}
                  value={educationForm.description}
                  onChangeText={(text) => handleEducationFieldChange('description', text)}
                  placeholder="Relevant coursework, thesis topic, or other details..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                />

                <Text style={styles.skillFieldLabel}>Achievements & Honors (Optional)</Text>
                <View style={styles.achievementInputRow}>
                  <TextInput
                    style={styles.achievementInput}
                    value={achievementInput}
                    onChangeText={setAchievementInput}
                    placeholder="e.g., Dean's List, Cum Laude"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity style={styles.achievementAddButton} onPress={handleAddAchievement}>
                    <Text style={styles.achievementAddButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
                {achievements.length > 0 && (
                  <View style={styles.achievementChipsWrap}>
                    {achievements.map((achievement, index) => (
                      <View key={`${achievement}-${index}`} style={styles.achievementChip}>
                        <Text style={styles.achievementChipText}>{achievement}</Text>
                        <TouchableOpacity onPress={() => handleRemoveAchievement(index)}>
                          <X color={'#797979'} size={14} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.modalActionsRow}>
                  <TouchableOpacity style={styles.modalCancelButton} onPress={handleCloseEducationModal}>
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.educationSaveButton} onPress={handleSaveEducation}>
                    <Text style={styles.modalSaveButtonText}>{editingEducationId ? 'Save Changes' : 'Add Education'}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>

          {/* Resumes Section */}
          <View style={styles.resumesSection}>
            <View style={styles.resumesHeader}>
              <View style={styles.resumesIconBox}>
                <FileText color={'#165DFC'} size={20} />
              </View>
              <Text style={styles.resumesTitle}>Resumes</Text>
              {resumesList?.length > 0 && (
                <View style={styles.resumesCountBadge}>
                  <Text style={styles.resumesCountBadgeText}>{resumesList.length}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.addResumeButton}>
                <Text style={styles.addResumeIcon}>+</Text>
                <Text style={styles.addResumeText}>Add</Text>
              </TouchableOpacity>
            </View>

            {resumesList?.length > 0 ? (
              <View style={styles.resumeCardList}>
                {resumesList.map((item: any, index: number) => (
                  <View key={item?.id || index} style={styles.resumeCard}>
                    <View style={styles.resumeCardIconBox}>
                      <FileText color={'#165DFC'} size={20} />
                    </View>
                    <View style={styles.resumeCardContent}>
                      <Text style={styles.resumeCardFileName} numberOfLines={1}>{item?.file_name}</Text>
                      <Text style={styles.resumeCardMetaText}>
                        {formatFileSize(item?.file_size)} · Uploaded {formatRelativeTime(item?.upload_date || item?.created_at)}
                      </Text>
                    </View>
                    <View style={styles.resumeCardActions}>
                      <TouchableOpacity style={styles.userSkillActionButton}>
                        {item?.is_primary ? <Star fill={'#F59E0B'} color={'#F59E0B'} size={18} /> : <StarOff color={'#9CA3AF'} size={18} />}
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.userSkillActionButton}>
                        <Download color={'#165DFC'} size={18} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.userSkillActionButton}>
                        <Trash2 color={'#EF4444'} size={18} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyResumeBox}>
                <FileText color={'#D1D5DC'} size={40} />
                <Text style={styles.noResumeText}>No resumes uploaded yet</Text>
                <Text style={styles.resumeDescription}>
                  Upload your resume so employers can review your profile
                </Text>
                <UploadVideo buttonLabel="Upload Resume" modalTitle="Upload Resume" />
              </View>
            )}
          </View>

          {/* Course Progress Section */}
          <View style={styles.courseProgressSection}>
            <View style={styles.courseProgressHeader}>
              <View style={styles.courseProgressIconBox}>
                <GraduationCap color={'#165DFC'} size={20} />
              </View>
              <Text style={styles.courseProgressTitle}>Course Progress</Text>
            </View>

            <View style={styles.emptyCourseBox}>
              <BookText color={'#D1D5DC'} size={40} />
              <Text style={styles.noCourseText}>No courses enrolled yet</Text>
              <Text style={styles.courseDescription}>
                Enroll in courses to boost your skills and career prospects. Complete courses to unlock job opportunities!
              </Text>
              <TouchableOpacity style={styles.browseCourseButton}>
                <Text style={styles.browseCourseButtonText}>Browse Courses</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewRecommendationsButton}>
                <Text style={styles.viewRecommendationsButtonText}>View Recommendations</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Password & Security Section */}
          <View style={styles.passwordSecuritySection}>
            <View style={styles.passwordSecurityHeader}>
              <View style={styles.passwordSecurityIconBox}>
                <Shield color={'#165DFC'} size={20} />
              </View>
              <Text style={styles.passwordSecurityTitle}>Password & Security</Text>
            </View>

            <View style={styles.securityInfoBox}>
              <View style={styles.securityInfoIconBox}>
                <Info color={'#165DFC'} size={20} />
              </View>
              <View style={styles.securityInfoContent}>
                <Text style={styles.securityInfoTitle}>You're signed in with Google</Text>
                <Text style={styles.securityInfoText}>
                  Your account uses Google authentication. To change your password, please visit your{' '}
                  <Text style={styles.googleAccountLink}>Google Account settings</Text>.
                </Text>
              </View>
            </View>

            <Text style={styles.securityTipsHeading}>Security Tips:</Text>
            <View style={styles.securityTipsContainer}>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  Enable two-factor authentication on your Google account
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  Regularly review connected apps and devices
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  Use a strong, unique password for your Google account
                </Text>
              </View>
            </View>
          </View>

          {/* Complete Your Profile Section */}
          <View style={styles.completeProfileSection}>
            <Text style={styles.completeProfileHeading}>Complete Your Profile</Text>

            <View style={styles.checklistContainer}>
              <View style={styles.checklistItem}>
                <View style={styles.uncheckedBox} />
                <Text style={styles.checklistText}>Add profile photo</Text>
              </View>

              <View style={styles.checklistItem}>
                <View style={styles.uncheckedBox} />
                <Text style={styles.checklistText}>Record video introduction</Text>
              </View>

              <View style={styles.checklistItem}>
                <View style={styles.checkedBox}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
                <Text style={[styles.checklistText, styles.completedText]}>Add personal information</Text>
              </View>

              <View style={styles.checklistItem}>
                <View style={styles.uncheckedBox} />
                <Text style={styles.checklistText}>Add professional bio</Text>
              </View>

              <View style={styles.checklistItem}>
                <View style={styles.uncheckedBox} />
                <Text style={styles.checklistText}>Add social links</Text>
              </View>

              <View style={styles.checklistItem}>
                <View style={styles.uncheckedBox} />
                <Text style={styles.checklistText}>Add work experience</Text>
              </View>

              <View style={styles.checklistItem}>
                <View style={styles.uncheckedBox} />
                <Text style={styles.checklistText}>Add skills & technologies</Text>
              </View>

              <View style={styles.checklistItem}>
                <View style={styles.uncheckedBox} />
                <Text style={styles.checklistText}>Upload resume</Text>
              </View>
            </View>
          </View>

        </ScrollView>)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#165DFC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
    textAlign: 'center',
  },
  filterButton: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 20,
    color: '#165DFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 28,
    backgroundColor: '#165DFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 56,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#165DFC',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconText: {
    fontSize: 20,
  },
  uploadDescription: {
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  supportedFormats: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginBottom: 12,
  },
  noVideoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#9CA3AF',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', gap: 6,
  },
  noVideoButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily: 'Geist-VariableFont_wght',
  },
  profileName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#363535',
    textTransform: 'capitalize',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#165DFC',
    textTransform: 'capitalize',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
  },
  statText: {
    fontSize: 14,
    textTransform: 'capitalize',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
  strengthSection: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  gaugeContainer: {
    marginBottom: 20,
  },
  gaugeOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  gaugeInner: {
    width: '100%',
    height: '100%',
    borderRadius: 74,
    backgroundColor: '#1A202C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugePercentage: {
    fontSize: 26,
    fontWeight: '700',
    color: '#10B981',
    fontFamily: 'Geist-VariableFont_wght',
  },
  strengthLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 2,
  },
  strengthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  strengthDescription: {
    fontSize: 13,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginBottom: 20,
  },
  completeProfileButton: {
    backgroundColor: '#165DFC',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  completeProfileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  videoSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#EAEBEE',
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#DBE9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  videoHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  uploadVideoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '50%',
    marginBottom: 16,
    backgroundColor: '#DBE9FF',
    marginRight: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  uploadVideoIcon: {
    fontSize: 16,
  },
  uploadVideoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  videoUploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  videoUploadIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  noVideoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  uploadVideoDescription: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
  },
  videoStatusContainer: {
    marginBottom: 16,
  },
  videoStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  statusText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
  videoInfoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  videoInfoIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  videoInfoText: {
    flex: 1,
    fontSize: 13,
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 18,
  },
  personalInfoSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#EAEBEE',
  },
  personalInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,

  },
  personalInfoIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 32,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#DBE9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personalInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: '#DBE9FF',
    justifyContent: 'center',
    width: 80,
    borderRadius: 8,
  },
  editIcon: {
    fontSize: 14,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  infoField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
  fieldInput: {
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  personalEditActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#165DFC',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  aboutMeSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EAEBEE',
  },
  aboutMeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutMeIcon: {
    fontSize: 24,
    marginRight: 12,
    backgroundColor: '#F3E7FF',
    borderRadius: 12,
    padding: 6,
    marginTop: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EAEBEE',
  },
  aboutMeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  aboutEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: '#F3E7FF',
    justifyContent: 'center',
    width: 80,
    borderRadius: 8,
  },
  editAboutIcon: {
    fontSize: 14,
  },
  editAboutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A855F7',
    fontFamily: 'Geist-VariableFont_wght',
  },
  bioBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  bioPlaceholderIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  noBioText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
    textAlign: 'center',
  },
  bioDescription: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    lineHeight: 16,
  },
  proTipBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  proTipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  proTipText: {
    fontSize: 12,
    color: '#78350F',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 16,
  },
  socialLinksSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EAEBEE',
  },
  socialLinksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  socialLinksIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 32,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#DBFCE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialLinksTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  editSocialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 16,
  },
  editSocialIcon: {
    fontSize: 14,
  },
  editSocialText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
    fontFamily: 'Geist-VariableFont_wght',
  },
  socialLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    gap: 12,
  },
  linkedinIconBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#165DFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkedinIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  websiteIconBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#00A63E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  websiteIcon: {
    fontSize: 18,
  },
  socialLinkContent: {
    flex: 1,
  },
  socialLinkLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 2,
  },
  socialLinkValue: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
  },
  socialProTipBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginTop: 8,
  },
  socialProTipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  socialProTipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78350F',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  socialProTipDescription: {
    fontSize: 12,
    color: '#78350F',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 16,
  },
  skillsSection: {
    width: '100%',
    paddingHorizontal: 0,
    marginTop: 24,
    marginBottom: 24,
  },
  skillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  skillsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addSkillIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#A855F7',
    fontFamily: 'Geist-VariableFont_wght',
  },
  addSkillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A855F7',
    fontFamily: 'Geist-VariableFont_wght',
  },
  emptySkillsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EAEBEE',
  },
  emptySkillsIcon: {
    fontSize: 32,
    marginBottom: 12,
    color: '#D1D5DB',
  },
  emptySkillsText: {
    fontSize: 13,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    lineHeight: 18,
  },
  userSkillsList: {
    gap: 12,
    marginHorizontal: 16,
  },
  userSkillCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEBEE',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  userSkillCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userSkillName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  userSkillActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  userSkillActionButton: {
    padding: 2,
  },
  userSkillMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  userSkillMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userSkillMetaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9810FA',
    fontFamily: 'Geist-VariableFont_wght',
  },
  // Shared modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalOverlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  modalSaveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  bioTextArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    minHeight: 130,
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    textAlignVertical: 'top',
  },
  bioModalFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  bioHintText: {
    flex: 1,
    fontSize: 11,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 15,
  },
  bioCounterText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  bioSaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#9810FA',
  },
  socialInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 6,
  },
  socialInputHint: {
    fontSize: 11,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 6,
    lineHeight: 15,
  },
  socialSecondFieldLabel: {
    marginTop: 16,
  },
  socialSaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#00A63E',
  },
  // Add Skill modal
  skillModalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  skillModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  skillModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  skillTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  skillTabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  skillTabButtonActive: {
    backgroundColor: '#9810FA',
  },
  skillTabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  skillTabButtonTextActive: {
    color: '#FFFFFF',
  },
  skillFieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 6,
    marginTop: 12,
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  skillPickerWrapper: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'center',
  },
  skillPicker: {
    width: '100%',
  },
  skillAddButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#9810FA',
  },
  workExperienceSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EAEBEE',
    marginHorizontal: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  experienceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#FFECD4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  experienceIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  addExperienceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: '#FFECD4',
    justifyContent: 'center',
    width: 140,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  addExperienceIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    fontFamily: 'Geist-VariableFont_wght',
  },
  addExperienceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'Geist-VariableFont_wght',
  },
  emptyExperienceBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEBEE',
  },
  emptyExperienceIcon: {
    fontSize: 32,
    marginBottom: 12,
    color: '#D1D5DB',
  },
  emptyExperienceText: {
    fontSize: 13,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    lineHeight: 18,
  },
  experienceTimelineList: {
    gap: 0,
  },
  experienceItemRow: {
    flexDirection: 'row',
  },
  experienceTimelineColumn: {
    alignItems: 'center',
    width: 40,
    marginRight: 8,
  },
  experienceTimelineIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFECD4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceTimelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#FFECD4',
    marginVertical: 4,
  },
  experienceCard: {
    flex: 1,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  experienceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  experienceCardTitleBox: {
    flex: 1,
  },
  experienceCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  experienceCardCompany: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F97316',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 2,
  },
  experienceCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  experienceCardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  experienceCardMetaText: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
  },
  experienceModalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  experienceModalCardContent: {
    padding: 20,
  },
  currentJobToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  experienceSaveButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F97316',
  },
  educationSaveButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#165DFC',
  },
  achievementInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  achievementInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  achievementAddButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#165DFC',
    backgroundColor: '#EFF6FF',
  },
  achievementAddButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  achievementChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  achievementChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  achievementChipText: {
    fontSize: 12,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  educationSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EAEBEE',
    marginHorizontal: 16,
  },
  educationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  educationIconBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  educationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  educationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
  },
  addEducationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addEducationIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  addEducationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  emptyEducationBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEBEE',
  },
  educationTimelineList: {
    gap: 0,
  },
  educationItemRow: {
    flexDirection: 'row',
  },
  educationTimelineColumn: {
    alignItems: 'center',
    width: 16,
    marginRight: 12,
    marginTop: 20,
  },
  educationTimelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#165DFC',
  },
  educationTimelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#DBE9FF',
    marginVertical: 4,
  },
  educationCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  educationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  educationCardTitleBox: {
    flex: 1,
  },
  educationCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  educationCardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 2,
  },
  educationCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  educationCardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  educationCardMetaText: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
  },
  educationCardMetaDot: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    marginHorizontal: 2,
  },
  emptyEducationIcon: {
    fontSize: 32,
    marginBottom: 12,
    color: '#D1D5DB',
  },
  noEducationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 12,
  },
  addFirstEducationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  addFirstEducationIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  addFirstEducationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  resumesSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EAEBEE',
    marginHorizontal: 16,
  },
  resumesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resumesIconBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resumesIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  resumesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
  },
  resumesCountBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resumesCountBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  resumeCardList: {
    gap: 12,
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEBEE',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  resumeCardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#DBE9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeCardContent: {
    flex: 1,
  },
  resumeCardFileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  resumeCardMetaText: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 2,
  },
  resumeCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addResumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addResumeIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  addResumeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  emptyResumeBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEBEE',
  },
  emptyResumeIcon: {
    fontSize: 32,
    marginBottom: 12,
    color: '#D1D5DB',
  },
  noResumeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 6,
  },
  resumeDescription: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginBottom: 12,
  },
  uploadResumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  uploadResumeIcon: {
    fontSize: 14,
    fontFamily: 'Geist-VariableFont_wght',
  },
  uploadResumeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  courseProgressSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EAEBEE',
    marginHorizontal: 16,
  },
  courseProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  courseProgressIconBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseProgressIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  courseProgressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  emptyCourseBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEBEE',
  },
  emptyCourseIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  noCourseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  browseCourseButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  browseCourseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
    fontFamily: 'Geist-VariableFont_wght',
  },
  viewRecommendationsButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  viewRecommendationsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  passwordSecuritySection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EAEBEE',
    marginHorizontal: 16,
  },
  passwordSecurityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  passwordSecurityIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  passwordSecurityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  securityInfoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityInfoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#165DFC',
    gap: 10,
  },
  securityInfoIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  securityInfoContent: {
    flex: 1,
  },
  securityInfoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  securityInfoText: {
    fontSize: 12,
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 18,
  },
  googleAccountLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  securityTipsHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 12,
  },
  securityTipsContainer: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 8,
  },
  tipBullet: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    width: 16,
  },
  tipText: {
    fontSize: 12,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
    lineHeight: 16,
  },
  completeProfileSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EAEBEE',
    marginHorizontal: 16,
  },
  completeProfileHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 16,
  },
  checklistContainer: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uncheckedBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  checkedBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  checklistText: {
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
  },
  completedText: {
    color: '#A3A3A3',
    textDecorationLine: 'line-through',
  },
});