import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'
import { ArrowLeft, CheckCircle2, Circle, Eye, EyeOff } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import DocumentPicker from 'react-native-document-picker'
import { checkEmail, registerJobSeeker } from '../../Redux/slices/loginSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../Redux'

const EmployerSignup = ({ navigation }: any) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  // Step 1 - Company Information
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [website, setWebsite] = useState('')
  const [headquarters, setHeadquarters] = useState('')
  const [description, setDescription] = useState('')

  // Step 2 - Contact Information
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [officialEmail, setOfficialEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'checking' | 'valid' | 'invalid' | ''>('')
  const [emailMessage, setEmailMessage] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [designation, setDesignation] = useState('')

  // Step 3 - Verification & Security
  const [registrationDocument, setRegistrationDocument] = useState<any>(null)
  const [selectedDocumentName, setSelectedDocumentName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [hiringTipsAccepted, setHiringTipsAccepted] = useState(false)

  const [errors, setErrors] = useState<any>({})
  const dispatch = useDispatch<AppDispatch>();
  const passwordRequirements = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'At least 1 uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'At least 1 lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'At least 1 number', valid: /[0-9]/.test(password) },
    { label: 'At least 1 special character', valid: /[^A-Za-z0-9\s]/.test(password) },
  ]

  useEffect(() => {
    const email = officialEmail.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

    if (!email) {
      setEmailStatus('')
      setEmailMessage('')
      return
    }

    if (!emailRegex.test(email)) {
      setEmailStatus(email.includes('@') && email.includes('.') ? 'invalid' : 'checking')
      setEmailMessage(email.includes('@') && email.includes('.')
        ? 'Please enter a valid email address'
        : 'Enter a complete work email address')
      return
    }

    const emailDomain = email.split('@')[1]
    const personalEmailDomain = /^(gmail\.com|googlemail\.com|yahoo\.[a-z.]+|ymail\.com|rocketmail\.com)$/i
    if (personalEmailDomain.test(emailDomain)) {
      setEmailStatus('invalid')
      setEmailMessage('Please use your official company email. Gmail and Yahoo addresses are not accepted.')
      return
    }

    setEmailStatus('checking')
    setEmailMessage('Checking availability...')
    let isCurrentRequest = true

    const timer = setTimeout(async () => {
      try {
        const result = await (dispatch as any)(checkEmail(email)).unwrap()
        if (isCurrentRequest) {
          setEmailStatus('valid')
          setEmailMessage(result?.message || 'Email is available')
        }
      } catch (error: any) {
        if (isCurrentRequest) {
          const message = typeof error?.message === 'string' ? error.message : ''
          const isRegistered = /already|registered|exists|taken/i.test(message)
          setEmailStatus('invalid')
          setEmailMessage(isRegistered ? 'Email already registered' : message || 'Unable to verify email. Please try again.')
        }
      }
    }, 300)

    return () => {
      isCurrentRequest = false
      clearTimeout(timer)
    }
  }, [dispatch, officialEmail])

  const validateStep1 = () => {
    // const newErrors: any = {}
    // if (!companyName.trim()) newErrors.companyName = 'Company name is required'
    // if (!industry) newErrors.industry = 'Industry is required'
    // if (!companySize) newErrors.companySize = 'Company size is required'
    // if (!headquarters.trim()) newErrors.headquarters = 'Headquarters location is required'
    // setErrors(newErrors)
    // return Object.keys(newErrors).length === 0
    return
  }

  const isStep2Valid = () => {
    // Email validation: must have @ and valid TLD (.com, .org, etc.)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
    const isEmailValid = officialEmail.trim() && emailRegex.test(officialEmail) && emailStatus === 'valid'

    // Phone validation: must be exactly 10 digits
    const isPhoneValid = contactPhone.trim() && contactPhone.length === 10 && /^\d{10}$/.test(contactPhone)

    return isEmailValid && isPhoneValid
  }

  const validateStep2 = () => {
    const newErrors: any = {}
    if (!firstName.trim()) newErrors.firstName = 'First name is required'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!officialEmail.trim()) newErrors.officialEmail = 'Email is required'
    if (officialEmail && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(officialEmail)) newErrors.officialEmail = 'Invalid email format (must contain @ and valid domain like .com)'
    if (officialEmail && emailStatus !== 'valid') newErrors.officialEmail = emailMessage || 'Please verify your official email address'
    if (!contactPhone.trim()) newErrors.contactPhone = 'Phone number is required'
    if (contactPhone && contactPhone.length !== 10) newErrors.contactPhone = 'Phone must be exactly 10 digits'
    if (!designation.trim()) newErrors.designation = 'Designation is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: any = {}
    if (!registrationDocument) newErrors.registrationDocument = 'Company registration document is required'
    if (!password) newErrors.password = 'Password is required'
    if (password && !passwordRequirements.every((requirement) => requirement.valid)) {
      newErrors.password = 'Password must meet all listed requirements'
    }
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!termsAccepted) newErrors.termsAccepted = 'Please accept terms and conditions'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    // if (currentStep === 1 && validateStep1()) {
    //   setCurrentStep(2)
    //   setErrors({})
    // } else if (currentStep === 2 && validateStep2()) {
    //   setCurrentStep(3)
    //   setErrors({})
    // }
    setCurrentStep((currentStep + 1) as 1 | 2 | 3)
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3)
      setErrors({})
    }
  }

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, 'image/png', 'image/jpeg'],
        copyTo: 'cachesDirectory',
      })

      const fileSize = result.size ?? 0
      if (fileSize > 5 * 1024 * 1024) {
        Alert.alert('File too large', 'Please select a file smaller than 5MB.')
        return
      }

      setRegistrationDocument(result)
      setSelectedDocumentName(result.name || 'Selected document')
      setErrors((prev: any) => ({ ...prev, registrationDocument: undefined }))
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        return
      }
      Alert.alert('Upload failed', 'Unable to select a document. Please try again.')
    }
  }

  const handleCreateAccount = async () => {
    if (validateStep3()) {
      const payload = {
        email: officialEmail,
        password: password,
        data: {
          full_name: firstName,
          user_type: "employer",
          phone: contactPhone,
          location: null,
          experience: null,
          current_role: null,
          company_name: companyName,
          industry: industry,
          company_size: companySize,
          designation: designation,
          company_location: headquarters,
          company_description: description,
          company_website: website,
        },
        gotrue_meta_security: {},
        code_challenge: "9gZyCba9j0WMskuP-auXOCEyFEPB849bUHzouLBZXhI",
        code_challenge_method: "s256"
      }
      const response = await dispatch(registerJobSeeker((payload)) as any);
      if (response?.payload?.id) {
        navigation.navigate('Login')
      }
      // TODO: Implement account creation logic
    }
  }

  const handleSignIn = () => {
    navigation?.navigate('SignIn')
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <ArrowLeft size={30} color="#000000" />
          </TouchableOpacity>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>Employer</Text>
            <Text style={styles.mainTitle}>Registration</Text>
            <Text style={styles.subtitle}>Join InterviewHighway to find top talent</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {currentStep === 1 ? (
              <>
                {/* STEP 1 - Company Information */}
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepText}>Step 1 of 3</Text>
                  <Text style={styles.stepLabel}>Company Information</Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar} />
                  <View style={styles.progressBarEmpty} />
                  <View style={styles.progressBarEmpty} />
                </View>

                {/* Company Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Company Name <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.companyName && styles.inputError]}
                    placeholder="Acme Corporation"
                    placeholderTextColor="#A0A0A0"
                    value={companyName}
                    onChangeText={setCompanyName}
                  />
                  {errors.companyName && <Text style={styles.errorText}>{errors.companyName}</Text>}
                </View>

                {/* Industry */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Industry <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.pickerContainer, errors.industry && styles.inputError]}>
                    <Picker
                      selectedValue={industry}
                      onValueChange={(itemValue) => setIndustry(itemValue)}
                      style={styles.picker}
                      itemStyle={styles.pickerItemIOS}
                      dropdownIconColor="#000000"
                    >
                      <Picker.Item label="Select your industry" value="" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="Technology" value="Technology" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="Finance" value="Finance" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="Healthcare" value="Healthcare" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="Education" value="Education" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="Retail" value="Retail" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="Manufacturing" value="Manufacturing" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="Other" value="Other" color="#000000" style={styles.pickerItem} />
                    </Picker>
                  </View>
                  {errors.industry && <Text style={styles.errorText}>{errors.industry}</Text>}
                </View>

                {/* Company Size */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Company Size <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.pickerContainer, errors.companySize && styles.inputError]}>
                    <Picker
                      selectedValue={companySize}
                      onValueChange={(itemValue) => setCompanySize(itemValue)}
                      style={styles.picker}
                      itemStyle={styles.pickerItemIOS}
                      dropdownIconColor="#000000"
                    >
                      <Picker.Item label="Select company size" value="" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="1-10 employees" value="1-10"color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="11-50 employees" value="11-50" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="51-200 employees" value="51-200" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="201-500 employees" value="201-500" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="501-1000 employees" value="501-1000" color="#000000" style={styles.pickerItem} />
                      <Picker.Item label="1000+ employees" value="1000+" color="#000000" style={styles.pickerItem} />
                    </Picker>
                  </View>
                  {errors.companySize && <Text style={styles.errorText}>{errors.companySize}</Text>}
                </View>

                {/* Company Website */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Company Website</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://www.example.com"
                    placeholderTextColor="#A0A0A0"
                    value={website}
                    onChangeText={setWebsite}
                    keyboardType="url"
                  />
                </View>

                {/* Headquarters Location */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Headquarters Location <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.headquarters && styles.inputError]}
                    placeholder="e.g., Mumbai, India"
                    placeholderTextColor="#A0A0A0"
                    value={headquarters}
                    onChangeText={setHeadquarters}
                  />
                  {errors.headquarters && <Text style={styles.errorText}>{errors.headquarters}</Text>}
                </View>

                {/* Company Description */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Company Description</Text>
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Brief description of your company"
                    placeholderTextColor="#A0A0A0"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Button Group */}
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                    <Text style={styles.nextButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}

            {currentStep === 2 ? (
              <>
                {/* STEP 2 - Contact Information */}
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepText}>Step 2 of 3</Text>
                  <Text style={styles.stepLabel}>Contact Information</Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar} />
                  <View style={styles.progressBar} />
                  <View style={styles.progressBarEmpty} />
                </View>

                {/* Two Column Row: First Name and Last Name */}
                <View style={styles.twoColumnRow}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.label}>
                      First Name <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, errors.firstName && styles.inputError]}
                      placeholder="John"
                      placeholderTextColor="#A0A0A0"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                    {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                  </View>
                  <View style={styles.inputColumn}>
                    <Text style={styles.label}>
                      Last Name <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, errors.lastName && styles.inputError]}
                      placeholder="Doe"
                      placeholderTextColor="#A0A0A0"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                    {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                  </View>
                </View>

                {/* Official Email Address */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Official Email Address <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.officialEmail && styles.inputError]}
                    placeholder="john.doe@company.com"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={officialEmail}
                    onChangeText={(text) => {
                      setOfficialEmail(text)
                      setEmailStatus('')
                      setEmailMessage('')
                      setErrors((current: any) => ({ ...current, officialEmail: undefined }))
                    }}
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
                  {errors.officialEmail && <Text style={styles.errorText}>{errors.officialEmail}</Text>}
                  <Text style={styles.helperText}>Please use your official company email (not Gmail, Yahoo, etc.)</Text>
                </View>

                {/* Phone Number */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Phone Number <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.contactPhone && styles.inputError]}
                    placeholder="9876543210"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="numeric"
                    maxLength={10}
                    value={contactPhone}
                    onChangeText={setContactPhone}
                  />
                  {errors.contactPhone && <Text style={styles.errorText}>{errors.contactPhone}</Text>}
                  <Text style={styles.helperText}>Enter 10-digit mobile number (numbers only)</Text>
                </View>

                {/* Your Designation */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Your Designation <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.designation && styles.inputError]}
                    placeholder="e.g., HR Manager, CEO"
                    placeholderTextColor="#A0A0A0"
                    value={designation}
                    onChangeText={setDesignation}
                  />
                  {errors.designation && <Text style={styles.errorText}>{errors.designation}</Text>}
                </View>

                {/* Button Group */}
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={styles.previousButton} onPress={handlePreviousStep}>
                    <Text style={styles.previousButtonText}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.nextButton, !isStep2Valid() && styles.buttonDisabled]}
                    onPress={handleNextStep}
                    disabled={!isStep2Valid()}
                  >
                    <Text style={styles.nextButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}

            {currentStep === 3 ? (
              <>
                {/* STEP 3 - Verification & Security */}
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepText}>Step 3 of 3</Text>
                  <Text style={styles.stepLabel}>Verification & Security</Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar} />
                  <View style={styles.progressBar} />
                  <View style={styles.progressBar} />
                </View>

                {/* Company Registration Document */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Company Registration Document <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[styles.uploadContainer, errors.registrationDocument && styles.uploadContainerError]}
                    onPress={handleDocumentPick}
                  >
                    <Text style={styles.uploadIcon}>📄</Text>
                    <Text style={styles.uploadText}>
                      {selectedDocumentName || 'Upload Company Registration'}
                    </Text>
                    <Text style={styles.uploadSubtext}>
                      {selectedDocumentName ? 'Tap to choose a different file' : 'PDF, JPG, or PNG (Max 5MB)'}
                    </Text>
                  </TouchableOpacity>
                  {errors.registrationDocument && <Text style={styles.errorText}>{errors.registrationDocument}</Text>}
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Password <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.passwordInputContainer, errors.password && styles.inputError]}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Create a strong password"
                      placeholderTextColor="#A0A0A0"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Eye size={18} color="#363535" /> : <EyeOff size={18} color="#363535" />}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.passwordRequirements}>
                    {passwordRequirements.map((requirement) => (
                      <View key={requirement.label} style={styles.passwordRequirement}>
                        {requirement.valid
                          ? <CheckCircle2 size={14} color="#10B981" />
                          : <Circle size={14} color="#9CA3AF" />}
                        <Text style={[styles.passwordRequirementText, requirement.valid && styles.passwordRequirementValid]}>
                          {requirement.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                {/* Confirm Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Confirm Password <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.passwordInputContainer, errors.confirmPassword && styles.inputError]}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#A0A0A0"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <Eye size={18} color="#363535" /> : <EyeOff size={18} color="#363535" />}
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                </View>

                {/* Terms & Conditions Checkbox */}
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
                      <Text style={styles.checkboxLink}>Terms of Service</Text>
                      <Text style={styles.checkboxLabel}> and </Text>
                      <Text style={styles.checkboxLink}>Privacy Policy</Text>
                    </View>
                  </TouchableOpacity>
                  {errors.termsAccepted && <Text style={styles.errorText}>{errors.termsAccepted}</Text>}
                </View>

                {/* Hiring Tips Checkbox */}
                <View style={styles.checkboxGroup}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setHiringTipsAccepted(!hiringTipsAccepted)}
                  >
                    <View style={[styles.checkbox, hiringTipsAccepted && styles.checkboxChecked]}>
                      {hiringTipsAccepted && <Text style={styles.checkboxCheckmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Send me hiring tips and platform updates (optional)</Text>
                  </TouchableOpacity>
                </View>

                {/* Button Group */}
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={styles.previousButton} onPress={handlePreviousStep}>
                    <Text style={styles.previousButtonText}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.submitButton} onPress={handleCreateAccount}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                    <Text style={styles.submitButtonText}>Registration</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

export default EmployerSignup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F1FF',
  },
  flex: {
    flex: 1,
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
  required: {
    color: '#ff4444',
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
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Geist-VariableFont_wght',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 150,
    color: '#000000',
  },
  pickerItem: {
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  pickerItemIOS: {
    color: '#000000',
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
  passwordRequirements: { marginTop: 8, gap: 6 },
  passwordRequirement: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  passwordRequirementText: { fontSize: 12, color: '#6B7280', fontFamily: 'Geist-VariableFont_wght' },
  passwordRequirementValid: { color: '#059669' },
  eyeIconText: {
    fontSize: 18,
    padding: 8,
  },
  uploadContainer: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  uploadContainerError: {
    borderColor: '#ff4444',
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 4,
    textAlign: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 6,
  },
  emailStatusChecking: { color: '#FFA500', fontWeight: '500' },
  emailStatusValid: { color: '#10B981', fontWeight: '500' },
  emailStatusInvalid: { color: '#ff4444', fontWeight: '500' },
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
  submitButton: {
    flex: 1,
    backgroundColor: '#165DFC',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
  backButton: {
    marginBottom: 16,
    padding: 8,
    alignSelf: 'flex-start',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
})
