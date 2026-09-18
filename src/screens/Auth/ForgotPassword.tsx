import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Check, CircleAlert, Mail } from 'lucide-react-native';
import supabase from '../../../supabase';
import type { AuthStackParamList } from '../../types/navigation';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPassword: React.FC = () => {
    const navigation = useNavigation<ForgotPasswordNavigationProp>();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResetLinkSent, setIsResetLinkSent] = useState(false);

    const handleResetPassword = async () => {
        const normalizedEmail = email.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        try {
            setIsLoading(true);
            setEmailError('');
            const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);

            if (error) {
                setEmailError(error.message);
                return;
            }

            setIsResetLinkSent(true);
        } catch {
            setEmailError('Unable to send a reset link. Please try again.');
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
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.panel}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoInterview}>INTERVIEW</Text>
                            <Text style={styles.logoHighway}>HIGHWAY</Text>
                            <Text style={styles.logoRegistered}>R</Text>
                        </View>

                        {isResetLinkSent ? (
                            <View style={styles.successContent}>
                                <View style={styles.successIcon}>
                                    <Check color="#00B94F" size={29} strokeWidth={3} />
                                </View>
                                <Text style={styles.title}>Check Your Email</Text>
                                <Text style={styles.description}>
                                    We've sent a password reset link to your email address. Please check your inbox and click the link to reset your password.
                                </Text>
                                <View style={styles.infoBox}>
                                    <View style={styles.infoHeading}>
                                        <CircleAlert color="#466A8E" size={14} fill="#466A8E" />
                                        <Text style={styles.infoTitle}>Important</Text>
                                    </View>
                                    <Text style={styles.infoText}>• The reset link will expire in 1 hour</Text>
                                    <Text style={styles.infoText}>• Check your spam folder if you don't see it</Text>
                                    <Text style={styles.infoText}>• You can only use the link once</Text>
                                </View>
                                <TouchableOpacity style={[styles.resetButton,{width: '100%', marginVertical: 10}]} onPress={() => navigation.goBack()} disabled={isLoading} activeOpacity={0.8}>
                                    <Text style={styles.resetButtonText}>Back to Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.resendButton} onPress={handleResetPassword} disabled={isLoading} activeOpacity={0.8}>
                                    {isLoading ? <ActivityIndicator color="#111827" size="small" /> : <Text style={styles.resendButtonText}>Resend Email</Text>}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.changeEmailButton}
                                    onPress={() => setIsResetLinkSent(false)}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.changeEmailButtonText}>Change Email</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.title}>Forgot Password?</Text>
                                <Text style={styles.description}>
                                    No worries! Enter your email address and we'll send you a link to reset your password.
                                </Text>

                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>Email Address</Text>
                                    <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
                                        <Mail color="#8792A2" size={17} strokeWidth={1.7} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter your email address"
                                            placeholderTextColor="#8D929A"
                                            value={email}
                                            onChangeText={(text) => {
                                                setEmail(text);
                                                if (emailError) setEmailError('');
                                            }}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            editable={!isLoading}
                                        />
                                    </View>
                                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                                </View>

                                <TouchableOpacity
                                    style={[styles.resetButton, isLoading ? styles.resetButtonDisabled : null]}
                                    onPress={handleResetPassword}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                >
                                    {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.resetButtonText}>Send Reset Link</Text>}
                                </TouchableOpacity>

                                <View style={styles.divider} />

                                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={isLoading}>
                                    <ArrowLeft size={16} color="#0757F6" />
                                    <Text style={styles.backButtonText}>Back to Login</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* Footer Section */}
                    <View style={styles.footerContainer}>
                        {/* Agreement Text */}
                        {/* <Text style={styles.agreementText}>
                                  By signing in, you agree to our terms of service and privacy policy
                                  <TouchableOpacity onPress={() =>  Linking.openURL('https://interviewhighway.com/terms')}>
                                    <Text style={styles.footerLink}>Terms of Service</Text>
                                  </TouchableOpacity>
                                  {' '}and{' '}
                                  <TouchableOpacity onPress={() =>  Linking.openURL('https://interviewhighway.com/privacy')}>
                                    <Text style={styles.footerLink}>Privacy Policy</Text>
                                  </TouchableOpacity>
                                </Text> */}

                        {/* Footer Links Grid */}
                        <View style={styles.footerLinksGrid}>
                            <TouchableOpacity style={styles.footerLinkItem} onPress={() => Linking.openURL('https://interviewhighway.com/about')}>
                                <Text style={styles.footerLinkText}>About Us</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerLinkItem} onPress={() => Linking.openURL('https://interviewhighway.com/acceptable-use')}>
                                <Text style={styles.footerLinkText}>Acceptable Use Policy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerLinkItem} onPress={() => Linking.openURL('https://interviewhighway.com/employer-agreement')}>
                                <Text style={styles.footerLinkText}>Employer Service Agreement</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerLinkItem} onPress={() => Linking.openURL('https://interviewhighway.com/cookies')}>
                                <Text style={styles.footerLinkText}>Cookie Policy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerLinkItem} onPress={() => Linking.openURL('https://interviewhighway.com/terms')}>
                                <Text style={styles.footerLinkText}>Terms of Use</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerLinkItem} onPress={() => Linking.openURL('https://interviewhighway.com/privacy')}>
                                <Text style={styles.footerLinkText}>Privacy Policy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerLinkItem} onPress={() => Linking.openURL('https://interviewhighway.com/demo')}>
                                <Text style={styles.footerLinkText}>Demo</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Copyright Text */}
                        <Text style={styles.copyrightText}>
                            © 2026 InterviewHighway. All rights reserved.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#EEF5FC' },
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 11, paddingVertical: 40 },
    panel: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 23, paddingTop: 39, paddingBottom: 30, shadowColor: '#64748B', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.17, shadowRadius: 24, elevation: 6, borderTopWidth: 3, borderColor: '#0757F6' },
    logoContainer: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: 36, borderWidth: 1.5, borderColor: '#111111', padding: 3, marginBottom: 34 },
    logoInterview: { backgroundColor: '#111111', color: '#FFFFFF', fontFamily: 'Geist-VariableFont_wght', fontSize: 15, fontWeight: '400', letterSpacing: 1.2, paddingHorizontal: 5, paddingVertical: 1 },
    logoHighway: { color: '#111111', fontFamily: 'Geist-VariableFont_wght', fontSize: 15, fontWeight: '400', letterSpacing: 1.2, marginLeft: 5 },
    logoRegistered: { color: '#111111', fontFamily: 'Geist-VariableFont_wght', fontSize: 7, alignSelf: 'flex-start', marginLeft: 1 },
    successContent: { alignItems: 'center' },
    successIcon: { alignItems: 'center', borderColor: '#00B94F', borderRadius: 22, borderWidth: 3, height: 44, justifyContent: 'center', marginBottom: 20, width: 44 },
    title: { color: '#111827', fontFamily: 'Geist-VariableFont_wght', fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
    description: { color: '#374151', fontFamily: 'Geist-VariableFont_wght', fontSize: 11, fontWeight: '400', lineHeight: 15, textAlign: 'center', marginBottom: 25 },
    fieldContainer: { marginBottom: 18 },
    label: { color: '#1F2937', fontFamily: 'Geist-VariableFont_wght', fontSize: 11, fontWeight: '600', marginBottom: 9 },
    inputWrapper: { alignItems: 'center', borderColor: '#D1D5DB', borderRadius: 9, borderWidth: 1.2, flexDirection: 'row', height: 43, paddingHorizontal: 11 },
    inputError: { borderColor: '#DC2626' },
    input: { color: '#111827', flex: 1, fontFamily: 'Geist-VariableFont_wght', fontSize: 14, height: '100%', marginLeft: 10, padding: 0 },
    errorText: { color: '#DC2626', fontFamily: 'Geist-VariableFont_wght', fontSize: 10, marginTop: 5 },
    resetButton: { alignItems: 'center', backgroundColor: '#0757F6', borderRadius: 10, height: 45, justifyContent: 'center' },
    resetButtonDisabled: { opacity: 0.65 },
    resetButtonText: { color: '#FFFFFF', fontFamily: 'Geist-VariableFont_wght', fontSize: 14, fontWeight: '500' },
    divider: { backgroundColor: '#D9DEE7', height: 1, marginTop: 18, marginBottom: 18 },
    backButton: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
    backButtonText: { color: '#0757F6', fontFamily: 'Geist-VariableFont_wght', fontSize: 12, fontWeight: '500' },
    infoBox: { alignSelf: 'stretch', backgroundColor: '#EAF4FF', borderColor: '#9DCEFF', borderRadius: 8, borderWidth: 1, marginBottom: 12, paddingHorizontal: 13, paddingVertical: 11 },
    infoHeading: { alignItems: 'center', flexDirection: 'row', gap: 7, marginBottom: 6 },
    infoTitle: { color: '#0757C5', fontFamily: 'Geist-VariableFont_wght', fontSize: 11, fontWeight: '600' },
    infoText: { color: '#0757C5', fontFamily: 'Geist-VariableFont_wght', fontSize: 10, lineHeight: 16 },
    resendButton: { alignItems: 'center', alignSelf: 'stretch', borderColor: '#D1D5DB', borderRadius: 10, borderWidth: 1.2, height: 45, justifyContent: 'center' },
    resendButtonText: { color: '#111827', fontFamily: 'Geist-VariableFont_wght', fontSize: 14, fontWeight: '500' },
    changeEmailButton: { alignItems: 'center', justifyContent: 'center', marginTop: 14, minHeight: 32 },
    changeEmailButtonText: { color: '#0757F6', fontFamily: 'Geist-VariableFont_wght', fontSize: 13, fontWeight: '500' },
    footer: { alignItems: 'center', marginTop: 24 },
    footerRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: 6 },
    footerText: { color: '#778395', fontFamily: 'Geist-VariableFont_wght', fontSize: 11 },
    footerSeparator: { color: '#B7C0CB', fontFamily: 'Geist-VariableFont_wght', fontSize: 11, marginHorizontal: 9 },
    copyright: { color: '#778395', fontFamily: 'Geist-VariableFont_wght', fontSize: 11, marginTop: 7 },
    footerLinksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4,
        marginBottom: 20,
        marginVertical: 20,
    },
    footerLinkItem: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    footerLinkText: {
        fontSize: 11,
        fontFamily: 'Geist-VariableFont_wght',
        fontWeight: '400',
        color: '#1853E9',
        textDecorationLine: 'none',
    },
    copyrightText: {
        fontSize: 11,
        fontFamily: 'Geist-VariableFont_wght',
        fontWeight: '400',
        color: '#CCC',
        textAlign: 'center',
    },
    footerContainer: {
        marginTop: 40,
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    agreementText: {
        fontSize: 12,
        fontFamily: 'Geist-VariableFont_wght',
        fontWeight: '400',
        color: '#999',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 18,
    },
});