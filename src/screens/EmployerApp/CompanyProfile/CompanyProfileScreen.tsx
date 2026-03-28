import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'

const CompanyProfileScreen = () => {
  const navigation = useNavigation()
  const [companyData] = useState({
    name: 'Test Company Ltd 1dev',
    about: 'A test company, for QA testing purposes, partnership with devA test company for QA testing purposes, partnership with devA test company for QA testing purposes, partnership with devA test company for QA testing purposes, partnership with devA test company for QA testing purposes, partnership with devA test company for QA testing purposes, partnership with devA test company for QA testing purposes, partnership with devA test company for QA testing purposes, partnership with devA test company for QA testing purposes, partnership with devA test company for QA testing purposes, partnership with devA test company for QA testing purposes, partnership with devA test company for QA testing purposes, testing purposes, partnership with devA test company for QA testing purposes, partnership w',
    website: 'cnn.com',
    industry: 'Finance',
    size: '11-50 employees',
    location: 'Bangalore, India',
    isVerified: true,
    lastUpdated: '11 March 2026',
  })

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
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerTitle}>Company Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your company information and branding</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Company Logo Section */}
        <View style={styles.logoCard}>
          <Text style={styles.logoTitle}>Company Logo</Text>
          <View style={styles.logoUploadContainer}>
            <MaterialCommunityIcons name="image-plus" size={48} color="#165DFC" />
            <Text style={styles.logoDescription}>Upload your company logo. Recommended size: 200x200px. Max 5MB (JPEG, PNG, GIF, WebP).</Text>
          </View>
        </View>

        {/* Company Information Card */}
        <View style={styles.infoCard}>
          {/* Company Name */}
          <View style={styles.infoSection}>
            <View style={styles.infoLabelRow}>
              <MaterialCommunityIcons name="building" size={16} color="#666" />
              <Text style={styles.infoLabel}>Company Name</Text>
            </View>
            <Text style={styles.infoValue}>{companyData.name}</Text>
          </View>

          <View style={styles.divider} />

          {/* About Company */}
          <View style={styles.infoSection}>
            <View style={styles.infoLabelRow}>
              <MaterialCommunityIcons name="information-outline" size={16} color="#666" />
              <Text style={styles.infoLabel}>About Company</Text>
            </View>
            <Text style={styles.infoValue}>{companyData.about}</Text>
          </View>

          <View style={styles.divider} />

          {/* Website */}
          <View style={styles.infoSection}>
            <View style={styles.infoLabelRow}>
              <MaterialCommunityIcons name="globe" size={16} color="#666" />
              <Text style={styles.infoLabel}>Website</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.infoValueLink}>{companyData.website}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Industry */}
          <View style={styles.infoSection}>
            <View style={styles.infoLabelRow}>
              <MaterialCommunityIcons name="briefcase-outline" size={16} color="#666" />
              <Text style={styles.infoLabel}>Industry</Text>
            </View>
            <Text style={styles.infoValue}>{companyData.industry}</Text>
          </View>

          <View style={styles.divider} />

          {/* Company Size */}
          <View style={styles.infoSection}>
            <View style={styles.infoLabelRow}>
              <MaterialCommunityIcons name="people" size={16} color="#666" />
              <Text style={styles.infoLabel}>Company Size</Text>
            </View>
            <Text style={styles.infoValue}>{companyData.size}</Text>
          </View>

          <View style={styles.divider} />

          {/* Location */}
          <View style={styles.infoSection}>
            <View style={styles.infoLabelRow}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
              <Text style={styles.infoLabel}>Location</Text>
            </View>
            <Text style={styles.infoValue}>{companyData.location}</Text>
          </View>

          {/* Last Updated */}
          <View style={styles.lastUpdatedContainer}>
            <Text style={styles.lastUpdatedText}>Last updated: {companyData.lastUpdated}</Text>
          </View>
        </View>

        {/* Company Verification Section */}
        <View style={styles.verificationCard}>
          <View style={styles.verificationHeader}>
            <View style={styles.verificationTitleRow}>
              <MaterialCommunityIcons name="shield-check" size={20} color="#00C853" />
              <Text style={styles.verificationTitle}>Company Verification</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="check-circle" size={16} color="#fff" />
              <Text style={styles.verifiedBadgeText}>Verified</Text>
            </View>
          </View>
          <Text style={styles.verificationDescription}>Verified companies get a trust badge visible to all candidates</Text>

          {/* Verification Status Box */}
          <View style={styles.verificationStatusBox}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#00C853" />
            <Text style={styles.verificationStatusText}>Your company has been verified. A trust badge is displayed on all your job postings.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CompanyProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },  header: {
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
  },  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
    gap: 6,
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
    marginBottom: 16,
  },
  logoUploadContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    gap: 12,
  },
  logoDescription: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    textAlign: 'center',
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
    backgroundColor: '#00C853',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
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