import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ArrowLeft, BriefcaseBusiness, Check, FileText, Pencil, User } from 'lucide-react-native/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AsyncStore from "../../../AsyncStore";
import { useDispatch } from 'react-redux';
import { applyJob, handleReloadJobs } from '../../../Redux/slices/homeSlice';
import ApplicationSuccessScreen from './ApplicationSuccessScreen';

const formatAppliedOn = (dateStr?: string | null) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    if (Number.isNaN(date.getTime())) { return ''; }
    return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

const ReviewJobApplication = ({ onBack, onSubmit, onBrowseMoreJobs, applicationData }: { onBack?: () => void; onSubmit?: () => void; onBrowseMoreJobs?: () => void; applicationData?: any }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

    const handleSubmitJobApplication = async () => {
        setIsSubmitting(true);
        try{
            const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
            const resultId = userId ? userId.replace(/"/g, '') : '';
            const formData = new FormData();
            formData.append('jobId', applicationData?.jobId);
            formData.append('userId', resultId);

            const response = await dispatch(applyJob(formData) as any);
            if (applyJob.fulfilled.match(response)) {
                const responsePayload = response.payload || {};
                setSuccessData({
                    jobTitle: applicationData?.jobTitle,
                    companyName: applicationData?.companyName,
                    applicationId: responsePayload?.application_id || responsePayload?.applicationId || responsePayload?.id,
                    appliedOn: formatAppliedOn(responsePayload?.created_at || responsePayload?.applied_at),
                    status: responsePayload?.status || 'Under Review',
                });
                dispatch(handleReloadJobs(true));
            }
        }catch(error){
            console.log('Error submitting job application:', error);
        }finally{
            setIsSubmitting(false);
        }
    };  

    if (successData) {
        return (
            <ApplicationSuccessScreen
                applicationData={successData}
                onGoToDashboard={onSubmit}
                onBrowseMoreJobs={onBrowseMoreJobs}
            />
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.screen}>
                <View style={styles.progressBar}>
                    <View style={styles.progressStep}>
                        <View style={styles.completedStep}><Check size={17} color="#FFFFFF" strokeWidth={2.5} /></View>
                        <Text style={styles.progressLabel}>Apply</Text>
                    </View>
                    <View style={styles.progressLineActive} />
                    <View style={styles.progressStep}>
                        <View style={styles.activeStep}><Text style={styles.stepNumber}>2</Text></View>
                        <Text style={[styles.progressLabel, styles.activeLabel]}>Review</Text>
                    </View>
                    <View style={styles.progressLine} />
                    <View style={styles.progressStep}>
                        <View style={styles.upcomingStep}><Text style={styles.upcomingNumber}>3</Text></View>
                        <Text style={styles.progressLabel}>Submit</Text>
                    </View>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} >
                    <View style={styles.intro}>
                        <Text style={styles.introTitle}>Review Your{`\n`}Application</Text>
                        <Text style={styles.introSubtitle}>Please review all information before{`\n`}submitting your application</Text>
                    </View>

                    <View style={styles.matchCard}>
                        <View style={styles.matchIcon}><Check size={21} color="#FFFFFF" strokeWidth={2.5} /></View>
                        <View style={styles.matchCopy}>
                            <Text style={styles.matchTitle}>Great news! Your{`\n`}profile is a strong{`\n`}match</Text>
                            <Text style={styles.matchSubtitle}>Your skills and{`\n`}experience align well{`\n`}with this position</Text>
                        </View>
                    </View>

                    <InfoCard icon={<BriefcaseBusiness size={20} color="#0757E8" />} title="Position Details">
                        <Detail label="POSITION" value={applicationData?.jobTitle} />
                        <Detail label="COMPANY" value={applicationData?.companyName} />
                        <Detail label="LOCATION" value={applicationData?.location} />
                        <Detail label="EXPERIENCE" value={applicationData?.experienceLevel} />
                        <Detail label="SALARY RANGE" value={applicationData?.salary || "Not Disclosed"} />
                        <Detail label="JOB TYPE" value={applicationData?.jobType} last />
                    </InfoCard>

                    <InfoCard icon={<User size={20} color="#0757E8" />} title="Your Information">
                        <Detail label="FULL NAME" value={applicationData?.fullName} />
                        <Detail label="EMAIL" value={applicationData?.email} />
                        <Detail label="PHONE" value={applicationData?.phoneNumber} />
                        <Detail label="CURRENT POSITION" value={applicationData?.currentJobTitle} />
                        <Detail label="EXPERIENCE" value={applicationData?.yearsOfExperience} />
                        <Detail label="EXPECTED CTC" value={applicationData?.expectedCTC} last />
                    </InfoCard>

                    <View style={styles.documentsSection}>
                        <View style={styles.sectionHeading}>
                            <View style={styles.headingIcon}><FileText size={20} color="#0757E8" /></View>
                            <Text style={styles.sectionTitle}>Attached Documents</Text>
                        </View>
                        <View style={styles.documentRow}>
                            <View style={styles.pdfIcon}><FileText size={18} color="#0757E8" ></FileText></View>
                           <View style={styles.documentInfo}>
                             <Text>{applicationData?.resume || 'N/A'}</Text>
                            <Text style={styles.documentName}>{applicationData?.resumeSize || 'N/A'} - Ready{`\n`}to upload</Text>
                             {/* <TouchableOpacity style={styles.changeButton} activeOpacity={0.8}>
                                <Pencil size={13} color="#ffff" />
                                <Text style={styles.changeText}>Change</Text>
                            </TouchableOpacity> */}
                           </View>
                           
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={onBack}>
                        <ArrowLeft size={21} color="#101828" />
                        <Text style={styles.backText}>Back{`\n`}to{`\n`}Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                        activeOpacity={0.85}
                        onPress={handleSubmitJobApplication}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <>
                                <Text style={styles.submitText}>Submit{`\n`}Application</Text>
                                <Check size={14} color="#FFFFFF" strokeWidth={3} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const InfoCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <View style={styles.infoCard}>
        <View style={styles.sectionHeading}>
            <View style={styles.headingIcon}>{icon}</View>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {children}
    </View>
);

const Detail = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
    <View style={[styles.detail, last && styles.lastDetail]}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

export default ReviewJobApplication;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF',},
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    progressBar: { height: 88, flexDirection: 'row', alignItems: 'flex-start', paddingTop: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    progressStep: { width: 68, alignItems: 'center', zIndex: 1 },
    completedStep: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#0757E8', alignItems: 'center', justifyContent: 'center' },
    activeStep: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#0757E8', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#DCE8FF' },
    upcomingStep: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E4E8ED', alignItems: 'center', justifyContent: 'center' },
    stepNumber: { color: '#FFFFFF', fontFamily: 'Geist-VariableFont_wght', fontWeight: '600', fontSize: 14 },
    upcomingNumber: { color: '#344054', fontFamily: 'Geist-VariableFont_wght', fontWeight: '600', fontSize: 14 },
    progressLine: { height: 2, flex: 1, backgroundColor: '#D9DEE6', marginTop: 15 },
    progressLineActive: { height: 2, flex: 1, backgroundColor: '#0757E8', marginTop: 15 },
    progressLabel: { marginTop: 10, fontSize: 12, color: '#101828', fontFamily: 'Geist-VariableFont_wght' },
    activeLabel: { color: '#0757E8', fontWeight: '600' },
    scrollView: { flex: 1,},
    content: { flexGrow: 1, paddingBottom: 24 },
    intro: { backgroundColor: '#DFEDFF', paddingHorizontal: 24, paddingVertical: 28 },
    introTitle: { fontSize: 25, lineHeight: 30, color: '#101828', fontWeight: '700', fontFamily: 'Geist-VariableFont_wght' },
    introSubtitle: { marginTop: 8, fontSize: 14, lineHeight: 21, color: '#263548', fontFamily: 'Geist-VariableFont_wght' },
    matchCard: { marginHorizontal: 24, marginTop: 27, marginBottom: 30, padding: 20, borderRadius: 11, borderWidth: 1, borderColor: '#65E6A5', backgroundColor: '#E7FFF1', flexDirection: 'row', alignItems: 'center' },
    matchIcon: { width: 40, height: 40, borderRadius: 11, backgroundColor: '#00C853', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    matchCopy: { flex: 1 },
    matchTitle: { color: '#006B35', fontSize: 16, lineHeight: 23, fontWeight: '700', fontFamily: 'Geist-VariableFont_wght' },
    matchSubtitle: { color: '#00723A', fontSize: 14, lineHeight: 20, marginTop: 3, fontFamily: 'Geist-VariableFont_wght' },
    infoCard: { marginHorizontal: 24, marginBottom: 33, padding: 20, borderRadius: 11, borderWidth: 1, borderColor: '#D9DEE6', backgroundColor: '#F8F9FB' },
    sectionHeading: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
    headingIcon: { width: 40, height: 40, borderRadius: 11, backgroundColor: '#DCEBFF', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    sectionTitle: { color: '#101828', fontSize: 16, fontWeight: '700', fontFamily: 'Geist-VariableFont_wght' },
    detail: { marginBottom: 18 },
    lastDetail: { marginBottom: 0 },
    detailLabel: { color: '#344054', fontSize: 12, letterSpacing: 0.4, fontFamily: 'Geist-VariableFont_wght' },
    detailValue: { color: '#101828', fontSize: 15, lineHeight: 20, marginTop: 9, fontWeight: '600', fontFamily: 'Geist-VariableFont_wght' },
    documentsSection: { marginHorizontal: 24 },
    documentRow: { minHeight: 68, borderRadius: 11, borderWidth: 1, borderColor: '#D9DEE6', backgroundColor: '#F8F9FB', padding: 10, flexDirection: 'row', alignItems: 'center' },
    documentInfo: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    pdfIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#DCEBFF', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    documentName: { flex: 1, color: '#344054', fontSize: 12, lineHeight: 17, fontFamily: 'Geist-VariableFont_wght' },
    changeButton: { height: 40,width:100, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#0058f1', flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 10, backgroundColor: '#0757E8' },
    changeText: { color: '#ffff', fontSize: 12, fontWeight: '600', fontFamily: 'Geist-VariableFont_wght', width: 50 },
    footer: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 10, flexDirection: 'row', gap: 14, backgroundColor: '#FFFFFF' },
    backButton: { height: 82, width: 106, borderRadius: 11, borderWidth: 2, borderColor: '#C5CBD5', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9 },
    backText: { color: '#101828', fontSize: 14, lineHeight: 20, fontWeight: '600', textAlign: 'center', fontFamily: 'Geist-VariableFont_wght' },
    submitButton: { flex: 1, height: 82, borderRadius: 11, backgroundColor: '#0757E8', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
    submitButtonDisabled: { opacity: 0.7 },
    submitText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '600', textAlign: 'center', fontFamily: 'Geist-VariableFont_wght' },
});