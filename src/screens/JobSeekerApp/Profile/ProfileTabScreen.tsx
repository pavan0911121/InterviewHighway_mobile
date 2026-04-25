import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { JobSeekerBottomTabParamList } from '../../../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookText, BriefcaseBusiness, Camera, CodeXml, Eye, FileText, Globe, GraduationCap, HardDriveUpload, Info, Lightbulb, Link, MapPin, Shield, SquarePen, Upload, UserRound, UserRoundPen, Video, VideoOff } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as AsyncStore from "../../../AsyncStore";
import { getProfileData } from '../../../Redux/slices/profileSlice';

type Props = BottomTabScreenProps<JobSeekerBottomTabParamList, 'ProfileTab'>;

export default function ProfileTabScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const selector = useSelector((state: any) => state.profile);


  useEffect(() => {
    fetchProfileData();
  }, []);

const fetchProfileData = async () => {
    try {
      // Fetch user data from async storage

      const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);
      if (userLoggedInData) {
        const parsedUserData = JSON.parse(userLoggedInData);
        const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
        // const userId = parsedUserData?.id || null;
        if ( userId) {
          const resultId = userId.replace(/"/g, '');
          const response = await dispatch(getProfileData(resultId) as any);
        }
      }

      // Dispatch profile action if needed
    } catch (error) {
      console.log('Error fetching profile data:', error);
    }
  };
  const userData = selector && selector?.data && selector?.data[0];
  const isLoading = selector?.isLoading;
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
                <Video fill={'#165DFC'} color={'white'} />
              </View>
              <Text style={styles.videoHeaderTitle}>Video Introduction</Text>
            </View>

            <TouchableOpacity style={styles.uploadVideoButton}>
              <HardDriveUpload fill={'#165DFC'} color={'#165DFC'} />
              <Text style={styles.uploadVideoText}>Upload Video</Text>
            </TouchableOpacity>

            <View style={styles.videoUploadBox}>
              <Text style={styles.videoUploadIcon}>📹</Text>
              <Text style={styles.noVideoText}>No video uploaded yet</Text>
              <Text style={styles.uploadVideoDescription}>Upload a video introduction</Text>
            </View>

            <View style={styles.videoStatusContainer}>
              <Text style={styles.videoStatusTitle}>Video Status</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Not uploaded</Text>
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

            <TouchableOpacity style={styles.editButton}>
              <SquarePen color={'#165DFC'} size={20} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <View style={styles.infoField}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <Text style={styles.fieldValue}>{userData?.name || 'Not provided'}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Text style={styles.fieldValue}>{userData?.email || 'Not provided'}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <Text style={styles.fieldValue}>{userData?.phone || 'Not provided'}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.fieldLabel}>Location</Text>
              <Text style={styles.fieldValue}>{userData?.location || 'Not provided'}</Text>
            </View>
          </View>

          {/* About Me Section */}
          <View style={styles.aboutMeSection}>
            <View style={styles.aboutMeHeader}>
              <View style={styles.aboutMeIcon}>
                <FileText fill={'#9810FA'} color={'white'} />
              </View>
              <Text style={styles.aboutMeTitle}>About Me</Text>
            </View>

            <TouchableOpacity style={styles.aboutEditButton}>
              <SquarePen color={'#9810FA'} size={20} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <View style={styles.bioBox}>
              <UserRoundPen fill={'#D1D5DC'} color={'white'} size={45} />
              <Text style={styles.noBioText}>No bio added yet</Text>
              <Text style={styles.bioDescription}>
                Add a professional bio to help employers understand your background and expertise
              </Text>
            </View>

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

            <TouchableOpacity style={styles.aboutEditButton}>
              <SquarePen color={'#00A63E'} size={20} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <View style={styles.socialLinkItem}>
              <View style={styles.linkedinIconBox}>
                <Text style={styles.linkedinIcon}>in</Text>
              </View>
              <View style={styles.socialLinkContent}>
                <Text style={styles.socialLinkLabel}>LinkedIn Profile</Text>
                <Text style={styles.socialLinkValue}>Not provided</Text>
              </View>
            </View>

            <View style={styles.socialLinkItem}>
              <View style={styles.websiteIconBox}>
                <Globe fill={"#fff"} color={'#00A63E'} />
              </View>
              <View style={styles.socialLinkContent}>
                <Text style={styles.socialLinkLabel}>Personal Website</Text>
                <Text style={styles.socialLinkValue}>Not provided</Text>
              </View>
            </View>

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
              <TouchableOpacity style={styles.addSkillButton}>
                <Text style={styles.addSkillIcon}>+</Text>
                <Text style={styles.addSkillText}>Add Skill</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.emptySkillsBox}>
              <CodeXml color={'#D1D5DC'} size={40} />
              <Text style={styles.emptySkillsText}>
                No skills added yet. Add your technical skills to showcase your expertise.
              </Text>
            </View>
          </View>

          {/* Work Experience Section */}
          <View style={styles.workExperienceSection}>
            <View style={styles.experienceHeader}>
              <View style={styles.experienceIconBox}>
                <BriefcaseBusiness fill={'#F54800'} color={'#FFECD4'} size={20} />
              </View>
              <Text style={styles.experienceTitle}>Work Experience</Text>
            </View>

            <TouchableOpacity style={styles.addExperienceButton}>
              <Text style={styles.addExperienceIcon}>+</Text>
              <Text style={styles.addExperienceText}>Add Experience</Text>
            </TouchableOpacity>

            <View style={styles.emptyExperienceBox}>
              <BriefcaseBusiness color={'#D1D5DC'} size={40} />
              <Text style={styles.emptyExperienceText}>
                No work experience added yet. Add your professional experience to showcase your career journey.
              </Text>
            </View>
          </View>

          {/* Education Section */}
          <View style={styles.educationSection}>
            <View style={styles.educationHeader}>
              <View style={styles.educationIconBox}>
                <GraduationCap color={'#165DFC'} size={20} />
              </View>
              <Text style={styles.educationTitle}>Education</Text>
              <TouchableOpacity style={styles.addEducationButton}>
                <Text style={styles.addEducationIcon}>+</Text>
                <Text style={styles.addEducationText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.emptyEducationBox}>
              <GraduationCap color={'#D1D5DC'} size={40} />
              <Text style={styles.noEducationText}>No education added yet</Text>
              <TouchableOpacity style={styles.addFirstEducationButton}>
                <Text style={styles.addFirstEducationIcon}>+</Text>
                <Text style={styles.addFirstEducationText}>Add Your First Education</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Resumes Section */}
          <View style={styles.resumesSection}>
            <View style={styles.resumesHeader}>
              <View style={styles.resumesIconBox}>
                <FileText color={'#165DFC'} size={20} />
              </View>
              <Text style={styles.resumesTitle}>Resumes</Text>
              <TouchableOpacity style={styles.addResumeButton}>
                <Text style={styles.addResumeIcon}>+</Text>
                <Text style={styles.addResumeText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.emptyResumeBox}>
              <FileText color={'#D1D5DC'} size={40} />
              <Text style={styles.noResumeText}>No resumes uploaded yet</Text>
              <Text style={styles.resumeDescription}>
                Upload your resume so employers can review your profile
              </Text>
              <TouchableOpacity style={styles.uploadResumeButton}>
                <Upload color={'#165DFC'} size={20} />
                <Text style={styles.uploadResumeText}>Upload Resume</Text>
              </TouchableOpacity>
            </View>
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