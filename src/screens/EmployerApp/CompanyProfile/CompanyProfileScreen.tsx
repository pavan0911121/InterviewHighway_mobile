import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Linking, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Picker } from '@react-native-picker/picker'
import DocumentPicker from 'react-native-document-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useDispatch, useSelector } from 'react-redux'
import * as AsyncStore from "../../../AsyncStore";
import { getEmployerProfile, updateEmployerProfile } from '../../../Redux/slices/employerProfileSlice'
import { Briefcase, Building2, Globe, MapPin, ShieldCheck, Upload, Users } from 'lucide-react-native'

const INDUSTRY_OPTIONS = ['Technology', 'Finance & Banking', 'Healthcare', 'Education', 'Retail & E-commerce', 'Manufacturing', 'Consulting', 'Media & Entertainment', 'Other']
const COMPANY_SIZE_OPTIONS = ['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '501-1000 employees', '1000+ employees']

const CompanyProfileScreen = () => {
  const navigation = useNavigation()

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedLogo, setSelectedLogo] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website_url: '',
    industry: '',
    company_size: '',
    location: '',
  })

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
        const response = await dispatch(getEmployerProfile(userId) as any);
      }
    } catch (error) {
      console.log("Error fetching user data from AsyncStorage:", error);
    }
  }
  const selector = useSelector((state: any) => state.employerProfile);
  const isLoading = selector?.isLoading;
  const companyData = selector?.courses?.data

  const handleEditProfile = () => {
    setFormData({
      name: companyData?.name || '',
      description: companyData?.description || '',
      website_url: companyData?.website_url || '',
      industry: companyData?.industry || '',
      company_size: companyData?.company_size || '',
      location: companyData?.location || '',
    })
    setSelectedLogo(null)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setSelectedLogo(null)
    setIsEditing(false)
  }

  const handlePickLogo = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      })
      setSelectedLogo(result)
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        return
      }
      Alert.alert('Upload failed', 'Unable to select an image. Please try again.')
    }
  }

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true)
      const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);
      if (userLoggedInData) {
        const parsedUserData = JSON.parse(userLoggedInData);
        const userId = parsedUserData?.id;
        const profileData: any = { ...formData }
        if (selectedLogo) {
          profileData.logo = selectedLogo
        }
        await dispatch(updateEmployerProfile({ userId, profileData }) as any);
        setIsEditing(false)
        setSelectedLogo(null)
      }
    } catch (error) {
      console.log("Error saving company profile:", error);
    } finally {
      setIsSaving(false)
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
          <View style={styles.headerContainer}>
            <View style={{ width: '70%' }}>
              <Text style={styles.headerTitle}>Company Profile</Text>
              <Text style={styles.headerSubtitle}>Manage your company information and branding</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile} disabled={isEditing}>
              {/* <MaterialCommunityIcons name="pencil" size={16} color="#fff" /> */}
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Company Logo Section */}
          <View style={styles.logoCard}>

            <View style={styles.logoUploadContainer}>
              <TouchableOpacity
                style={styles.logoImageWrapper}
                onPress={isEditing ? handlePickLogo : undefined}
                activeOpacity={isEditing ? 0.7 : 1}
              >
                <Image
                  source={{ uri: selectedLogo?.uri || 'https://reybgptehrkxuqtjwbqp.supabase.co/storage/v1/object/public/companies/company-logos/fe99cd44-52c4-40d5-9415-de482efc0c6c-1773225303366.jpeg' }}
                  style={styles.companyLogo}
                />
                {isEditing && (
                  <View style={styles.logoUploadBadge}>
                    <Upload color={'#fff'} size={14} />
                  </View>
                )}
              </TouchableOpacity>
              <View >
                <Text style={styles.logoTitle}>Company Logo</Text>
                <Text style={styles.logoDescription}>{'Upload your company logo.\nRecommended size: 200x200px.\nMax 5MB (JPEG, PNG, GIF, WebP).'}</Text>
              </View>
            </View>
          </View>

          {/* Company Information Card */}
          <View style={styles.infoCard}>
            {/* Company Name */}
            <View style={styles.infoSection}>
              <View style={styles.infoLabelRow}>
                <Building2 color={'#666'} size={16} />
                <Text style={styles.infoLabel}>Company Name</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter company name"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.infoValue}>{companyData?.name}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* About Company */}
            <View style={styles.infoSection}>
              <View style={styles.infoLabelRow}>
                <Briefcase color={'#666'} size={16} />
                <Text style={styles.infoLabel}>About Company</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={[styles.editInput, styles.editInputMultiline]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Tell candidates about your company"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                />
              ) : (
                <Text style={styles.infoValue}>{companyData?.description}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Website */}
            <View style={styles.infoSection}>
              <View style={styles.infoLabelRow}>
                <Globe color={'#666'} size={16} />
                {/* <MaterialCommunityIcons name="globe" size={16} color="#666" /> */}
                <Text style={styles.infoLabel}>Website</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={formData.website_url}
                  onChangeText={(text) => setFormData({ ...formData, website_url: text })}
                  placeholder="www.example.com"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  keyboardType="url"
                />
              ) : (
                <TouchableOpacity onPress={() => {
                  const url = companyData?.website_url?.startsWith('http') ? companyData?.website_url : `https://${companyData?.website_url}`;
                  if (url) {
                    Linking.openURL(url);
                  }
                }}>
                  <Text style={styles.infoValueLink}>{companyData?.website_url}</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.divider} />

            {/* Industry */}
            <View style={styles.infoSection}>
              <View style={styles.infoLabelRow}>
                <Briefcase color={'#666'} size={16} />
                <Text style={styles.infoLabel}>Industry</Text>
              </View>
              {isEditing ? (
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select industry" value="" />
                    {INDUSTRY_OPTIONS.map((option) => (
                      <Picker.Item key={option} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
              ) : (
                <Text style={styles.infoValue}>{companyData?.industry}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Company Size */}
            <View style={styles.infoSection}>
              <View style={styles.infoLabelRow}>
                <Users color={'#666'} size={16} />
                <Text style={styles.infoLabel}>Company Size</Text>
              </View>
              {isEditing ? (
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.company_size}
                    onValueChange={(value) => setFormData({ ...formData, company_size: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select company size" value="" />
                    {COMPANY_SIZE_OPTIONS.map((option) => (
                      <Picker.Item key={option} label={`${option} employees`} value={option} />
                    ))}
                  </Picker>
                </View>
              ) : (
                <Text style={styles.infoValue}>{companyData?.company_size}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Location */}
            <View style={styles.infoSection}>
              <View style={styles.infoLabelRow}>
               <MapPin color={'#666'} size={16} />
                <Text style={styles.infoLabel}>Location</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={formData.location}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                  placeholder="Enter company location"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.infoValue}>{companyData?.location}</Text>
              )}
            </View>

            {/* Last Updated */}
            <View style={styles.lastUpdatedContainer}>
              <Text style={styles.lastUpdatedText}>Last updated: {companyData?.updated_at}</Text>
            </View>

            {isEditing && (
              <View style={styles.editActionsRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Company Verification Section */}
          <View style={styles.verificationCard}>
            <View style={styles.verificationHeader}>
              <View style={styles.verificationTitleRow}>
                <ShieldCheck color={'#00C853'} size={18} />
                <Text style={styles.verificationTitle}>Company Verification</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <ShieldCheck color={'#007539'} size={16} />
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.verificationDescription}>Verified companies get a trust badge visible to all candidates</Text>

            {/* Verification Status Box */}
            <View style={styles.verificationStatusBox}>
              <ShieldCheck color={'#00C853'} size={20} />
              <Text style={styles.verificationStatusText}>Your company has been verified. A trust badge is displayed on all your job postings.</Text>
            </View>
          </View>
        </ScrollView>)}
    </SafeAreaView>
  )
}

export default CompanyProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  }, header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    gap: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 20,
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
  }, scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  headerSubtitle: {
    width: '90%',
    fontSize: 14,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    // gap: 6,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
  logoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 24,
  },
  logoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  logoUploadContainer: {
    alignItems: 'center',
    // paddingVertical: 32,
    borderRadius: 12,
    // gap: 12,
    flexDirection: 'row',
  },
  logoImageWrapper: {
    position: 'relative',
  },
  logoUploadBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#165DFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  logoDescription: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    textAlign: 'left',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 24,
  },
  infoSection: {
    paddingVertical: 14,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 20,
  },
  infoValueLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 20,
  },
  editInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  editInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  picker: {
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  lastUpdatedContainer: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
  },
  editActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 18,
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
  },
  saveButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#165DFC',
    minWidth: 120,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
  verificationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 24,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  verificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4FDE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007539',
    fontFamily: 'Geist-VariableFont_wght',
  },
  verificationDescription: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    marginBottom: 14,
  },
  verificationStatusBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  verificationStatusText: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
})