import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
  // CheckBox,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { getRole, getVerifiedUser, postUserData } from '../../Redux/slices/loginSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import supabase from '../../../supabase';
import { useEffect } from 'react';
import * as AsyncStore from '../../AsyncStore';
// import { signInWithEmail, prepareGoogleAuthData } from '../../utils/supabaseAuth';


const googleIcon = require('../../assets/google.png');

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginForm {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  // const { login, isLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [loginError, setLoginError] = useState<string>('');
  const [googleConfigInitialized, setGoogleConfigInitialized] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  // Initialize Google Sign-In configuration once on component mount
  useEffect(() => {
    const initializeGoogleSignIn = async () => {
      try {
        GoogleSignin.configure({
          webClientId: '788719402448-7bgr231umerf4nqmjodp3qiar26terre.apps.googleusercontent.com',
          iosClientId: '788719402448-19qjpf9u043a7p82jcoajbkee6bcctfp.apps.googleusercontent.com',
          offlineAccess: false,
          forceCodeForRefreshToken: true,
        });

        // Sign out first to ensure clean state on first attempt
        try {
          await GoogleSignin.signOut();
        } catch (signOutError) {
          // Ignore error if user wasn't signed in
          console.log('Sign out info:', signOutError);
        }

        setGoogleConfigInitialized(true);
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        setGoogleConfigInitialized(true); // Still set to true to allow retry
      }
    };

    initializeGoogleSignIn();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleValidation = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!form.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!handleValidation()) {
      return;
    }
    try {
      setLoginError('');
      setIsLoading(true);
      
      const data = {
        email: form.email,
        password: form.password,
      };

      const result = await dispatch(postUserData(data) as any);
      const userId = await dispatch(getVerifiedUser(result?.payload?.user?.id) as any)

      if (result.type.includes('fulfilled')) {
        // Login successful
        console.log('Login successful with Supabase token');
      } else if (result.type.includes('rejected')) {
        const errorMessage = result.payload?.message || 'Login failed. Please check your credentials and try again.';
        if (errorMessage === 'Email not confirmed') {
          setLoginError('Please check your email and click the verification link before signing in.');
        } else {
          setLoginError(errorMessage);
        }
      }
    } catch (error) {
      console.log(error, "error from login");
      setLoginError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password navigation
    console.log('Forgot password pressed');
  };

  const handleSignUp = () => {
    navigation.navigate('AccountTypeSelection');
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoginError('');
      setIsLoading(true);

      // Ensure Google Sign-In is initialized before proceeding
      if (!googleConfigInitialized) {
        setLoginError('Google Sign-In is initializing. Please try again.');
        setIsLoading(false);
        return;
      }

      // Check for Play Services availability
      try {
          await GoogleSignin.hasPlayServices()
          const response = await GoogleSignin.signIn()
          if (response?.type === 'success' ) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.data.idToken as string,
            })
            console.log(data,"data from gogle signin");
            
            if(error) {
              setLoginError(error.message || 'Authentication failed');
              setIsLoading(false);
              return;
            }

            if(data?.session?.access_token) {
              // Store token and login status
              await AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, data?.session?.access_token);
              await AsyncStore.storeData(AsyncStore.Keys.IS_LOGIN, "true");
              await AsyncStore.storeData(AsyncStore.Keys.USER_DATA, JSON.stringify(data?.session?.user));
              
              
              // Store user data
              if(data?.user) {
                await AsyncStore.storeData(AsyncStore.Keys.USER_DATA, JSON.stringify(data.user));
              }
            }
            
            // Fetch verified user and role - this will update Redux state
            const userResult = await dispatch(getVerifiedUser(data?.user?.id) as any);
            
            
            // The App.tsx will automatically detect Redux state changes and navigate
          }
        } catch (error: any) {
          if (error.code === statusCodes.IN_PROGRESS) {
            setLoginError('Sign in already in progress');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            setLoginError('Google Play Services not available or outdated');
          } else {
            setLoginError('Google Sign-In failed. Please try again.');
            console.error('Google Sign-In Error:', error);
          }
        }

    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      setLoginError('Google Sign-In failed. Please ensure your device has internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.subtitleText}>Sign in to your account to continue your career journey</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.email ? styles.inputError : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor="#999"
                  value={form.email}
                  onChangeText={(text) => {
                    setForm({ ...form, email: text });
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined });
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password ? styles.inputError : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={form.password}
                  onChangeText={(text) => {
                    setForm({ ...form, password: text });
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Remember Me and Forgot Password Row */}
            <View style={styles.rememberForgotContainer}>
              {/* <View style={styles.checkboxContainer}>
                <CheckBox
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  disabled={isLoading}
                />
                <Text style={styles.rememberText}>Remember me</Text>
              </View> */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Error Message */}
            {loginError && (
              <View style={styles.errorMessageContainer}>
                <Text style={styles.errorMessageText}>{loginError}</Text>
              </View>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity
              style={styles.googleButton}
              disabled={isLoading || !googleConfigInitialized}
              activeOpacity={0.7}
              onPress={handleGoogleSignIn}
            >
              <Image
                source={googleIcon}
                style={styles.googleButtonIcon}
              />
              <Text style={styles.googleButtonText}>
                {!googleConfigInitialized ? 'Initializing...' : 'Continue with google'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.signUpLinkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 0,
    padding: 0,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1853E9',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: '#FF4444',
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: 'Geist-VariableFont_wght',
    color: '#000',
    fontWeight: '400',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Geist-VariableFont_wght',
    color: '#FF4444',
    marginTop: 6,
  },
  errorMessageContainer: {
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderRadius: 6,
  },
  errorMessageText: {
    fontSize: 13,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
    color: '#FF4444',
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberText: {
    fontSize: 14,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    color: '#666',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
    color: '#1853E9',
  },
  loginButton: {
    backgroundColor: '#1853E9',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
    color: '#FFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    color: '#999',
  },
  googleButton: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    gap: 10,
  },
  googleButtonIcon: {
    fontSize: 18,
    width: 20,
    height: 20,
  },
  googleButtonText: {
    fontSize: 14,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
    color: '#000',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signUpText: {
    fontSize: 14,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    color: '#666',
  },
  signUpLinkText: {
    fontSize: 14,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
    color: '#1853E9',
  },
});

export default LoginScreen;
