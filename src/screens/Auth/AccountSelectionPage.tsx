import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../types/navigation'

type AccountSelectionNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const AccountSelectionPage = () => {
  const [selectedType, setSelectedType] = useState<'jobseeker' | 'employer' | null>(null)
  const navigation = useNavigation<AccountSelectionNavigationProp>();
  const handleSignIn = () => {
    navigation.navigate('JobSeekerSignup');
    // TODO: Implement sign in navigation
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Blue Bar */}
      <View style={styles.topBar} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Heading */}
        <Text style={styles.mainHeading}>Join</Text>
        <Text style={styles.mainHeading}>InterviewHighway</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Choose your account type to get started with your career journey
        </Text>

        {/* Job Seeker Card */}
        <TouchableOpacity
          style={[
            styles.accountCard,
            selectedType === 'jobseeker' && styles.accountCardSelected,
          ]}
          onPress={() => setSelectedType('jobseeker')}
        >
          <Text style={styles.accountIcon}>👤</Text>
          <Text style={styles.accountTitle}>Job Seeker</Text>
          <Text style={styles.accountDescription}>
            Find your dream job and advance your career
          </Text>
          <View style={styles.bulletContainer}>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Search for opportunities</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Complete skill courses</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Build professional profile</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Employer Card */}
        <TouchableOpacity
          style={[
            styles.accountCard,
            selectedType === 'employer' && styles.accountCardSelected,
          ]}
          onPress={() => setSelectedType('employer')}
        >
          <Text style={styles.accountIcon}>🏢</Text>
          <Text style={styles.accountTitle}>Employer</Text>
          <Text style={styles.accountDescription}>
            Hire top talent with verified skills
          </Text>
          <View style={styles.bulletContainer}>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Post job openings</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Find skilled candidates</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Set course requirements</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedType && styles.continueButtonDisabled,
          ]}
          disabled={!selectedType}
        >
          <Text style={styles.continueButtonText}>Select an account type to continue</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AccountSelectionPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    height: 4,
    backgroundColor: '#165DFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 14,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 32,
    lineHeight: 20,
  },
  accountCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  accountCardSelected: {
    borderColor: '#165DFC',
    backgroundColor: '#F0F9FF',
  },
  accountIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  accountTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  accountDescription: {
    fontSize: 14,
    color: '#597182',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  bulletContainer: {
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#597182',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
    width: 14,
  },
  bulletText: {
    fontSize: 12,
    color: '#000000',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
    lineHeight: 16,
  },
  continueButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  continueButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signInText: {
    fontSize: 13,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  signInLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    textDecorationLine: 'underline',
  },
})