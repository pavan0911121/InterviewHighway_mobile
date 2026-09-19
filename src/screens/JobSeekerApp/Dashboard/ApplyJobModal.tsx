import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Alert,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import {
    X,
    User,
    Briefcase,
    FileText,
    Mail,
    Check,
    Plus,
    MapPin,
    Camera,
    Clock,
} from 'lucide-react-native/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as AsyncStore from '../../../AsyncStore';
import { getResumes, uploadResume } from '../../../Redux/slices/profileSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackIdentifiersParamList } from '../../../types/navigation';
import ReviewJobApplication from './ReviewJobApplication';

interface ApplyJobModalProps {
    visible: boolean;
    onClose: () => void;
    job: any;
    onSubmit?: (payload: any) => void;
    onBrowseMoreJobs?: () => void;
}

const EXPERIENCE_OPTIONS = [
    { label: 'Select experience', value: '' },
    { label: 'Fresher (0 years)', value: '0' },
    { label: '1 year', value: '1' },
    { label: '2 years', value: '2' },
    { label: '3 years', value: '3' },
    { label: '4 years', value: '4' },
    { label: '5+ years', value: '5+' },
];

const formatFileSize = (bytes?: number | null) => {
    if (bytes == null || Number.isNaN(bytes)) { return ''; }
    if (bytes < 1024) { return `${bytes} B`; }
    const kb = bytes / 1024;
    if (kb < 1024) { return `${kb.toFixed(2)} KB`; }
    return `${(kb / 1024).toFixed(2)} MB`;
};

const formatJobType = (employmentType?: string | null) => {
    if (!employmentType) { return ''; }
    const spaced = employmentType.replace(/_/g, ' ');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const formatSalary = (job: any) => {
    if (job?.salary_min == null && job?.salary_max == null) { return 'Salary not disclosed'; }
    if (job?.salary_min != null && job?.salary_max != null) { return `${job.salary_min} - ${job.salary_max}`; }
    return `${job?.salary_min ?? job?.salary_max}`;
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

export default function ApplyJobModal({ visible, onClose, job, onSubmit, onBrowseMoreJobs }: ApplyJobModalProps) {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const profileSelector = useSelector((state: any) => state.profile);
    const homeSelector = useSelector((state: any) => state.home);

    const resumesList = profileSelector?.resumes?.resumes || profileSelector?.resumes || [];
    const userData = homeSelector && homeSelector?.profileByIdData?.[0];

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [currentJobTitle, setCurrentJobTitle] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [expectedCTC, setExpectedCTC] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        if (visible) {
            setFullName(userData?.name || '');
            setPhoneNumber(userData?.phone || '');
            setCurrentJobTitle(userData?.current_role || '');
            setYearsOfExperience(userData?.experience_level || '');
            loadResumes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible,userData]);

    useEffect(() => {
        if (Array.isArray(resumesList) && resumesList.length > 0 && !selectedResumeId) {
            setSelectedResumeId(resumesList[0]?.id ?? null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumesList]);

    const loadResumes = async () => {
        try {
            const userId = await AsyncStore.getData(AsyncStore.Keys.USER_ID);
            const resultUserId = userId ? userId.replace(/"/g, '') : '';
            if (resultUserId) {
                dispatch(getResumes({ userId: resultUserId }) as any);
            }
        } catch (error) {
            console.log('Error loading resumes:', error);
        }
    };

    const handleAddNewResume = async () => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [types.pdf, types.doc, types.docx],
            });
            const userId = await AsyncStore.getData(AsyncStore.Keys.USER_ID);
            const resultUserId = userId ? userId.replace(/"/g, '') : '';

            const formData = new FormData();
            formData.append('resume', {
                uri: result.uri,
                type: result.type || 'application/pdf',
                name: result.name || 'resume.pdf',
            } as any);
            formData.append('userId', resultUserId);

            const response = await dispatch(uploadResume({ payload: formData }) as any);
            if (uploadResume.fulfilled.match(response)) {
                loadResumes();
            } else {
                Alert.alert('Error', 'Failed to upload resume.');
            }
        } catch (err: any) {
            if (DocumentPicker.isCancel(err)) {
                return;
            }
            Alert.alert('Error', err?.message || 'Unable to select file.');
        }
    };

    const resetForm = () => {
        setCurrentJobTitle('');
        setYearsOfExperience('');
        setExpectedCTC('');
        setCoverLetter('');
        setAgreedToTerms(false);
    };

    const handleReviewApplication = () => {
        if (!fullName.trim()) {
            Alert.alert('Missing information', 'Please enter your full name.');
            return;
        }
        if (!currentJobTitle.trim()) {
            Alert.alert('Missing information', 'Please enter your current job title.');
            return;
        }
        if (!yearsOfExperience) {
            Alert.alert('Missing information', 'Please select your years of experience.');
            return;
        }
        if (!expectedCTC.trim()) {
            Alert.alert('Missing information', 'Please enter your expected CTC.');
            return;
        }
        if (!selectedResumeId) {
            Alert.alert('Missing information', 'Please select a resume to apply with.');
            return;
        }
        if (!agreedToTerms) {
            Alert.alert('Missing information', 'Please accept the Terms and Conditions and Privacy Policy.');
            return;
        }

        setShowReviewModal(true);
    };

    const handleConfirmSubmit = () => {
        const payload = {
            jobId: job?.id,
            fullName,
            phoneNumber,
            currentJobTitle,
            yearsOfExperience,
            expectedCTC,
            resumeId: selectedResumeId,
            coverLetter,
        };
        onSubmit?.(payload);
        resetForm();
        setShowReviewModal(false);
        onClose();
    };

    const handleBrowseMoreJobs = () => {
        resetForm();
        setShowReviewModal(false);
        onClose();
        onBrowseMoreJobs?.();
    };

    const companyName = job?.companies?.name ?? job?.company ?? '';
    const companyInitials = companyName?.slice(0, 2)?.toUpperCase();
    const isRemote = job?.location?.toLowerCase?.() === 'remote';
    const experienceOptions = EXPERIENCE_OPTIONS.some((option) => option.value === yearsOfExperience)
        ? EXPERIENCE_OPTIONS
        : [{ label: yearsOfExperience, value: yearsOfExperience }, ...EXPERIENCE_OPTIONS];
        const jobType = formatJobType(job?.employment_type);
        const selectedResume = Array.isArray(resumesList)
            ? resumesList.find((item: any, index: number) => (item?.id ?? index) === selectedResumeId)
            : null;
        const resumeSize = formatFileSize(selectedResume?.file_size);
        const resumeName = selectedResume?.file_name;
        const email = homeSelector?.userMetaData?.email;
    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
                <KeyboardAvoidingView
                    style={[styles.container, {paddingVertical: Platform.OS === 'ios' ? 50 : 30}]}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {showReviewModal ? (
                        <ReviewJobApplication
                        applicationData = {{
                            jobTitle:job?.title,
                            companyName: companyName,
                            location: job?.location,
                            experienceLevel: job?.experience_level,
                            jobType,
                            salary: job?.salary_max,
                            fullName,
                            phoneNumber,
                            email,
                            currentJobTitle,
                            yearsOfExperience,
                            expectedCTC,
                            resumeId: selectedResumeId,
                            resume: resumeName,
                            resumeSize,
                            coverLetter,
                            jobId: job?.id,
                        }}
                            onBack={() => setShowReviewModal(false)}
                            onSubmit={handleConfirmSubmit}
                            onBrowseMoreJobs={handleBrowseMoreJobs}
                        />
                    ) : (
                    <>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <X size={18} color="#363535" />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Job Summary Card */}
                        <View style={styles.jobCard}>
                            <View style={styles.jobCardTopRow}>
                                <Text style={styles.jobCardTitle}>{job?.title}</Text>
                                <View style={styles.companyLogoBox}>
                                    <Text style={styles.companyLogoText}>{companyInitials}</Text>
                                </View>
                            </View>
                            <Text style={styles.jobCardCompany}>{companyName}</Text>

                            <View style={styles.jobCardMetaRow}>
                                <MapPin size={14} color="#165DFC" />
                                <Text style={styles.jobCardMetaText}>{job?.location}</Text>
                                <Briefcase size={14} color="#165DFC" style={styles.jobCardMetaIconSpacer} />
                                <Text style={styles.jobCardMetaText}>{job?.experience_level}</Text>
                            </View>
                            <View style={styles.jobCardMetaRow}>
                                <Camera size={14} color="#165DFC" />
                                <Text style={styles.jobCardMetaText}>{formatSalary(job)}</Text>
                            </View>
                            <View style={styles.jobCardMetaRow}>
                                <Clock size={14} color="#165DFC" />
                                <Text style={styles.jobCardMetaText}>{jobType}</Text>
                            </View>

                            <View style={styles.tagsRow}>
                                {isRemote && (
                                    <View style={styles.remoteTag}>
                                        <Text style={styles.remoteTagText}>Remote Work</Text>
                                    </View>
                                )}
                                {job?.video_intro_required && (
                                    <View style={styles.videoTag}>
                                        <Text style={styles.videoTagText}>Video Intro Required</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Application Form Card */}
                        <View style={styles.formCard}>
                            <Text style={styles.headerTitle}>Submit Your Application</Text>
                            <Text style={styles.headerSubtitle}>Fill in the details below to apply for this position</Text>

                            {/* Personal Information */}
                            <View style={styles.sectionHeaderRow}>
                                <View style={styles.sectionIconBox}>
                                    <User size={16} color="#FFFFFF" />
                                </View>
                                <Text style={styles.sectionTitle}>Personal Information</Text>
                            </View>

                            <Text style={styles.fieldLabel}>Full Name <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="e.g., John Doe"
                                placeholderTextColor="#9CA3AF"
                            />

                            <Text style={styles.fieldLabel}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                placeholder="e.g., 9014395541"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                            />

                            {/* Professional Information */}
                            <View style={styles.sectionHeaderRow}>
                                <View style={styles.sectionIconBox}>
                                    <Briefcase size={16} color="#FFFFFF" />
                                </View>
                                <Text style={styles.sectionTitle}>Professional Information</Text>
                            </View>

                            <Text style={styles.fieldLabel}>Current Job Title <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                value={currentJobTitle}
                                onChangeText={setCurrentJobTitle}
                                placeholder="e.g., Software Engineer"
                                placeholderTextColor="#9CA3AF"
                            />

                            <Text style={styles.fieldLabel}>Years of Experience <Text style={styles.required}>*</Text></Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={yearsOfExperience}
                                    onValueChange={(value) => setYearsOfExperience(value)}
                                    style={styles.picker}
                                >
                                    {experienceOptions.map((option) => (
                                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                                    ))}
                                </Picker>
                            </View>

                            <Text style={styles.fieldLabel}>Expected CTC <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                value={expectedCTC}
                                onChangeText={setExpectedCTC}
                                placeholder="e.g., 8 LPA"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numbers-and-punctuation"
                            />

                            {/* Resume/CV */}
                            <View style={styles.sectionHeaderRow}>
                                <View style={styles.sectionIconBox}>
                                    <FileText size={16} color="#FFFFFF" />
                                </View>
                                <Text style={styles.sectionTitle}>Resume/CV <Text style={styles.required}>*</Text></Text>
                            </View>

                            <View style={styles.resumeHeaderRow}>
                                <Text style={styles.resumeHeaderLabel}>Your Saved Resumes</Text>
                                <TouchableOpacity style={styles.addResumeButton} onPress={handleAddNewResume}>
                                    <Plus size={14} color="#8B3DFF" />
                                    <Text style={styles.addResumeText}>Add New Resume</Text>
                                </TouchableOpacity>
                            </View>

                            {Array.isArray(resumesList) && resumesList.length > 0 ? (
                                resumesList.map((item: any, index: number) => {
                                    const isSelected = selectedResumeId === (item?.id ?? index);
                                    return (
                                        <TouchableOpacity
                                            key={item?.id ?? index}
                                            style={[styles.resumeCard, isSelected && styles.resumeCardSelected]}
                                            onPress={() => setSelectedResumeId(item?.id ?? index)}
                                        >
                                            <View style={styles.resumeCardIconBox}>
                                                <FileText size={18} color="#8B3DFF" />
                                            </View>
                                            <View style={styles.resumeCardInfo}>
                                                <Text style={styles.resumeCardFileName} numberOfLines={1}>{item?.file_name}</Text>
                                                <Text style={styles.resumeCardMeta}>
                                                    {formatFileSize(item?.file_size)} · Uploaded {formatRelativeTime(item?.upload_date || item?.created_at)}
                                                </Text>
                                            </View>
                                            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                                {isSelected && <View style={styles.radioInner} />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <Text style={styles.noResumeText}>No resumes uploaded yet. Add one to continue.</Text>
                            )}

                            {/* Cover Letter */}
                            <View style={styles.sectionHeaderRow}>
                                <View style={styles.sectionIconBox}>
                                    <Mail size={16} color="#FFFFFF" />
                                </View>
                                <Text style={styles.sectionTitle}>Cover Letter</Text>
                            </View>

                            <Text style={styles.fieldLabel}>Cover Letter (Optional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={coverLetter}
                                onChangeText={setCoverLetter}
                                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                            />

                            {/* Confirmation */}
                            <View style={styles.sectionHeaderRow}>
                                <View style={[styles.sectionIconBox, styles.sectionIconCircle]}>
                                    <Check size={16} color="#FFFFFF" />
                                </View>
                                <Text style={styles.sectionTitle}>Confirmation</Text>
                            </View>

                            <TouchableOpacity style={styles.confirmationRow} onPress={() => setAgreedToTerms(!agreedToTerms)}>
                                <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                                    {agreedToTerms && <Check size={13} color="#FFFFFF" />}
                                </View>
                                <Text style={styles.confirmationText}>
                                    I agree to the <Text style={styles.linkText}>Terms and Conditions</Text> and{' '}
                                    <Text style={styles.linkText}>Privacy Policy</Text>, and confirm that all information provided is accurate. <Text style={styles.required}>*</Text>
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.reviewButton, isSubmitting && styles.reviewButtonDisabled]}
                                onPress={handleReviewApplication}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.reviewButtonText}>Review Application</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                    </>
                    )}
                </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEBEE',
    },
    headerTextBlock: {
        flex: 1,
        paddingRight: 12,
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#181818',
        fontFamily: 'Geist-VariableFont_wght',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#797979',
        fontFamily: 'Geist-VariableFont_wght',
        marginTop: 4,
        marginBottom: 4,
    },
    closeButton: {
        alignSelf: 'flex-end',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#EAEBEE',
        
    },
    scrollContent: {
        padding: 16,
        paddingTop: 8,
        paddingBottom: 32,
    },
    jobCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EAEBEE',
        padding: 16,
        marginBottom: 16,
    },
    jobCardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    jobCardTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#181818',
        fontFamily: 'Geist-VariableFont_wght',
        lineHeight: 26,
    },
    companyLogoBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#165DFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    companyLogoText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: 'Geist-VariableFont_wght',
    },
    jobCardCompany: {
        fontSize: 14,
        color: '#4A5565',
        fontFamily: 'Geist-VariableFont_wght',
        marginTop: 4,
        marginBottom: 12,
    },
    jobCardMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    jobCardMetaIconSpacer: {
        marginLeft: 14,
    },
    jobCardMetaText: {
        fontSize: 13,
        color: '#4A5565',
        fontFamily: 'Geist-VariableFont_wght',
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    remoteTag: {
        backgroundColor: '#DCFCE7',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    remoteTagText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#16A34A',
        fontFamily: 'Geist-VariableFont_wght',
    },
    videoTag: {
        backgroundColor: '#FFE9D5',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    videoTagText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#EA7B17',
        fontFamily: 'Geist-VariableFont_wght',
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EAEBEE',
        padding: 16,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
        marginBottom: 14,
    },
    sectionIconBox: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: '#165DFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionIconCircle: {
        borderRadius: 15,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#181818',
        fontFamily: 'Geist-VariableFont_wght',
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#363535',
        fontFamily: 'Geist-VariableFont_wght',
        marginBottom: 6,
    },
    required: {
        color: '#EF4444',
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#363535',
        fontFamily: 'Geist-VariableFont_wght',
        marginBottom: 14,
    },
    textArea: {
        height: 110,
    },
    pickerWrapper: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        marginBottom: 14,
        overflow: 'hidden',
    },
    picker: {
        color: '#363535',
    },
    resumeHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    resumeHeaderLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#363535',
        fontFamily: 'Geist-VariableFont_wght',
    },
    addResumeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addResumeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8B3DFF',
        fontFamily: 'Geist-VariableFont_wght',
    },
    resumeCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EAEBEE',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 14,
    },
    resumeCardSelected: {
        borderColor: '#8B3DFF',
        backgroundColor: '#F5F0FF',
    },
    resumeCardIconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#EFE6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resumeCardInfo: {
        flex: 1,
    },
    resumeCardFileName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#363535',
        fontFamily: 'Geist-VariableFont_wght',
    },
    resumeCardMeta: {
        fontSize: 11,
        color: '#797979',
        fontFamily: 'Geist-VariableFont_wght',
        marginTop: 2,
    },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: '#8B3DFF',
    },
    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8B3DFF',
    },
    noResumeText: {
        fontSize: 13,
        color: '#797979',
        fontFamily: 'Geist-VariableFont_wght',
        marginBottom: 14,
    },
    confirmationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginBottom: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: '#165DFC',
        borderColor: '#165DFC',
    },
    confirmationText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        color: '#4A5565',
        fontFamily: 'Geist-VariableFont_wght',
    },
    linkText: {
        color: '#165DFC',
        fontWeight: '600',
    },
    reviewButton: {
        backgroundColor: '#165DFC',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
    },
    reviewButtonDisabled: {
        opacity: 0.6,
    },
    reviewButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: 'Geist-VariableFont_wght',
    },
});
