import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useState, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { useDispatch, useSelector } from 'react-redux'
import { checkEmail, registerJobSeeker, updateExperience, updateUserData } from '../../Redux/slices/loginSlice'

const JobSeekerSignup = ({ navigation }: any) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  // Step 1 - Basic Information
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [emailStatus, setEmailStatus] = useState('') // 'checking' | 'valid' | 'invalid' | ''
  const [emailMessage, setEmailMessage] = useState('') // Status message to display

  // Step 2 - Professional Information
  const [experienceLevel, setExperienceLevel] = useState('Select your experience level')
  const [currentRole, setCurrentRole] = useState('')
  const [preferredLocation, setPreferredLocation] = useState('')
  const [keySkills, setKeySkills] = useState('')
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false)

  // Step 3 - Account Security
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [jobAlerts, setJobAlerts] = useState(false)

  const experienceLevels = ['Fresher', '0-1 Years', '1-3 Years', '3-5 Years', '5+ Years']
  const dispatch = useDispatch();
  const selector = useSelector((state: any) => state.login);

  // Password validation
  const passwordValidation = useMemo(() => {
    return {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    }
  }, [password])

  const handleNextStep = (step: 1 | 2 | 3) => {
    if (step === 1) {
      dispatch(updateUserData({ firstName, lastName, email, mobileNumber: phone }))
    }else if (step === 2) {
      dispatch(updateExperience({ experienceLevel, currentRole, preferredLocation }))
    }
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3)
    }
  }

  const isStep1Valid = () => {
    // Check if first name is not empty
    const isFirstNameValid = firstName.trim().length > 0
    
    // Check if last name is not empty
    const isLastNameValid = lastName.trim().length > 0
    
    // Check if phone is exactly 10 digits
    const isPhoneValid = phone.trim().length === 10 && /^\d{10}$/.test(phone)
    
    // Check if email is verified (API confirmed it's available)
    const isEmailValid = emailStatus === 'valid'
    
    // Return true only if all conditions are met
    return isFirstNameValid && isLastNameValid && isPhoneValid && isEmailValid
  }

  const handleEmailChange = (text: string) => {
    setEmail(text)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

    // If empty, clear messages
    if (!text.trim()) {
      setEmailStatus('')
      setEmailMessage('')
      return
    }

    // Check if email has @ and .com format
    if (text.includes('@') && text.includes('.')) {
      // Show checking availability message
      setEmailStatus('checking')
      setEmailMessage('Checking availability...')

      // Validate with regex
      if (!emailRegex.test(text)) {
        // Invalid format
        setEmailStatus('invalid')
        setEmailMessage('Please enter a valid email address')
        return
      }

      // Wait 0.3 seconds then call the API
      const timer = setTimeout(async () => {
        if (emailRegex.test(text)) {
          try {
            const response = await dispatch(checkEmail(text) as any)
            // Handle success - email is available
            setEmailStatus('valid')
            setEmailMessage(response?.payload?.message)
          } catch (error) {
            console.log('Email verification error:', error)
            setEmailStatus('invalid')
            setEmailMessage('Email already registered')
          }
        }
      }, 300)

      return () => clearTimeout(timer)
    } else if (text.includes('@') || text.includes('.')) {
      // User is typing but hasn't completed format
      setEmailStatus('checking')
      setEmailMessage('Checking availability...')
    } else {
      setEmailStatus('')
      setEmailMessage('')
    }
  }

  const handleEmailVerification = async () => {
    // Email validation: must have @ and valid TLD (.com, .org, etc.)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

    if (email.trim() && emailRegex.test(email)) {
      try {
        const response = await dispatch(checkEmail(email) as any);
        // Handle the response - you can check if email is available or already registered
      } catch (error) {
        console.log('Email verification error:', error)
      }
    }
  }

  const handleCreateAccount = async() => {
    const payload = { 
      firstName: firstName, 
      lastName: lastName, 
      email: email, 
      mobileNumber: phone, 
      experienceLevel: experienceLevel, 
      currentRole: currentRole, 
      preferredLocation: preferredLocation, 
      keySkills: keySkills, 
      password: password, 
      jobAlerts: jobAlerts 
    }
    const response = await dispatch(registerJobSeeker((payload)) as any);
    if (response?.payload?.id) {
      navigation.navigate('Login')
    }
    // TODO: Implement account creation logic
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <ArrowLeft size={30} color="#000000" />
        </TouchableOpacity>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Create your</Text>
          <Text style={styles.mainTitle}>Account</Text>
          <Text style={styles.subtitle}>
            Join InterviewHighway to find your dream job
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {currentStep === 1 ? (
            <>
              {/* STEP 1 - Basic Information */}
              <View style={styles.stepIndicator}>
                <Text style={styles.stepText}>Step 1 of 3</Text>
                <Text style={styles.stepLabel}>Basic Information</Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar} />
                <View style={styles.progressBarEmpty} />
                <View style={styles.progressBarEmpty} />
              </View>

              <View style={styles.twoColumnRow}>
                <View style={styles.inputColumn}>
                  <Text style={styles.label}>First Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="John"
                    placeholderTextColor="#A0A0A0"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={styles.inputColumn}>
                  <Text style={styles.label}>Last Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    placeholderTextColor="#A0A0A0"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="john.doe@example.com"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={handleEmailChange}
                />
                {emailMessage ? (
                  <Text style={[
                    styles.helperText,
                    emailStatus === 'checking' && styles.emailStatusChecking,
                    emailStatus === 'valid' && styles.emailStatusValid,
                    emailStatus === 'invalid' && styles.emailStatusInvalid,
                  ]}>
                    {emailMessage}
                  </Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="numeric"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                />
                <Text style={styles.helperText}>
                  Enter 10-digit Indian mobile number (numbers only)
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.nextButton, !isStep1Valid() && styles.buttonDisabled]}
                onPress={() => handleNextStep(1)}
                disabled={!isStep1Valid()}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.googleButton}>
                <Text style={styles.googleIcon}>🔍</Text>
                <Text style={styles.googleButtonText}>Continue with google</Text>
              </TouchableOpacity>
            </>
          ) : null}

          {currentStep === 2 ? (
            <>
              {/* STEP 2 - Professional Information */}
              <View style={styles.stepIndicator}>
                <Text style={styles.stepText}>Step 2 of 3</Text>
                <Text style={styles.stepLabel}>Professional Information</Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar} />
                <View style={styles.progressBar} />
                <View style={styles.progressBarEmpty} />
              </View>

              {/* Experience Level Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Experience Level *</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowExperienceDropdown(!showExperienceDropdown)}
                >
                  <Text style={styles.dropdownText}>{experienceLevel}</Text>
                  <Text style={styles.dropdownIcon}>{showExperienceDropdown ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showExperienceDropdown && (
                  <View style={styles.dropdownMenu}>
                    {experienceLevels.map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setExperienceLevel(level)
                          setShowExperienceDropdown(false)
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{level}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Current Role */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Role</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Software Engineer, Fresher"
                  placeholderTextColor="#A0A0A0"
                  value={currentRole}
                  onChangeText={setCurrentRole}
                />
              </View>

              {/* Preferred Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Preferred Location *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Mumbai, Bangalore, Remote"
                  placeholderTextColor="#A0A0A0"
                  value={preferredLocation}
                  onChangeText={setPreferredLocation}
                />
              </View>

              {/* Key Skills */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Key Skills *</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="e.g., JavaScript, React, Node.js, Communication"
                  placeholderTextColor="#A0A0A0"
                  value={keySkills}
                  onChangeText={setKeySkills}
                  multiline
                  numberOfLines={3}
                />
                <Text style={styles.helperText}>
                  List your key skills separated by commas
                </Text>
              </View>

              {/* Button Group */}
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.previousButton} onPress={handlePreviousStep}>
                  <Text style={styles.previousButtonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={() => handleNextStep(2)}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}

          {currentStep === 3 ? (
            <>
              {/* STEP 3 - Account Security */}
              <View style={styles.stepIndicator}>
                <Text style={styles.stepText}>Step 3 of 3</Text>
                <Text style={styles.stepLabel}>Account Security</Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar} />
                <View style={styles.progressBar} />
                <View style={styles.progressBar} />
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password *</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Create a strong password"
                    placeholderTextColor="#A0A0A0"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeIconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password must contain:</Text>
                <View style={styles.requirementsList}>
                  <View style={styles.requirementItem}>
                    <View
                      style={[
                        styles.requirementCheckbox,
                        passwordValidation.minLength && styles.requirementCheckboxValid,
                      ]}
                    >
                      {passwordValidation.minLength && (
                        <Text style={styles.requirementCheckmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.requirementText}>At least 8 characters</Text>
                  </View>

                  <View style={styles.requirementItem}>
                    <View
                      style={[
                        styles.requirementCheckbox,
                        passwordValidation.uppercase && styles.requirementCheckboxValid,
                      ]}
                    >
                      {passwordValidation.uppercase && (
                        <Text style={styles.requirementCheckmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.requirementText}>One uppercase letter</Text>
                  </View>

                  <View style={styles.requirementItem}>
                    <View
                      style={[
                        styles.requirementCheckbox,
                        passwordValidation.lowercase && styles.requirementCheckboxValid,
                      ]}
                    >
                      {passwordValidation.lowercase && (
                        <Text style={styles.requirementCheckmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.requirementText}>One lowercase letter</Text>
                  </View>

                  <View style={styles.requirementItem}>
                    <View
                      style={[
                        styles.requirementCheckbox,
                        passwordValidation.number && styles.requirementCheckboxValid,
                      ]}
                    >
                      {passwordValidation.number && (
                        <Text style={styles.requirementCheckmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.requirementText}>One number</Text>
                  </View>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password *</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Re-enter your password"
                    placeholderTextColor="#A0A0A0"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text style={styles.eyeIconText}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms & Conditions */}
              <View style={styles.checkboxGroup}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                >
                  <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                    {termsAccepted && <Text style={styles.checkboxCheckmark}>✓</Text>}
                  </View>
                  <View style={styles.checkboxText}>
                    <Text style={styles.checkboxLabel}>I accept the </Text>
                    <TouchableOpacity>
                      <Text style={styles.checkboxLink}>Terms of Service</Text>
                    </TouchableOpacity>
                    <Text style={styles.checkboxLabel}> and </Text>
                    <TouchableOpacity>
                      <Text style={styles.checkboxLink}>Privacy Policy</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Job Alerts Checkbox */}
              <View style={styles.checkboxGroup}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setJobAlerts(!jobAlerts)}
                >
                  <View style={[styles.checkbox, jobAlerts && styles.checkboxChecked]}>
                    {jobAlerts && <Text style={styles.checkboxCheckmark}>✓</Text>}
                  </View>
                  <Text style={styles.optionalCheckboxLabel}>
                    Send me job alerts and career tips (optional)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Button Group */}
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.previousButton} onPress={handlePreviousStep}>
                  <Text style={styles.previousButtonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
                  <Text style={styles.createButtonText}>Create</Text>
                  <Text style={styles.createButtonText}>Account</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default JobSeekerSignup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F1FF',
  },
  backButton: {
    marginBottom: 16,
    padding: 8,
    alignSelf: 'flex-start',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginTop: 8,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  stepLabel: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'Geist-VariableFont_wght',
  },
  progressBarContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#165DFC',
    borderRadius: 3,
  },
  progressBarEmpty: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputColumn: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  eyeIcon: {
    padding: 8,
  },
  eyeIconText: {
    fontSize: 18,
  },
  requirementsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  requirementsList: {
    gap: 6,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requirementCheckboxValid: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  requirementCheckmark: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  requirementText: {
    fontSize: 12,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  helperText: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 6,
  },
  checkboxGroup: {
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#165DFC',
    borderColor: '#165DFC',
  },
  checkboxCheckmark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  checkboxText: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  checkboxLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    textDecorationLine: 'underline',
  },
  optionalCheckboxLabel: {
    fontSize: 13,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#999999',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  previousButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  previousButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#165DFC',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#165DFC',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 13,
    color: '#999999',
    fontFamily: 'Geist-VariableFont_wght',
    marginHorizontal: 12,
  },
  googleButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleIcon: {
    fontSize: 20,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 13,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  signUpLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    textDecorationLine: 'underline',
  },
  emailStatusChecking: {
    color: '#FFA500',
    fontWeight: '500',
  },
  emailStatusValid: {
    color: '#10B981',
    fontWeight: '500',
  },
  emailStatusInvalid: {
    color: '#ff4444',
    fontWeight: '500',
  },
})
