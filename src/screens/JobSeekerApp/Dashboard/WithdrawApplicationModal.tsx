import React from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Clock3, CircleCheck, Eye, UserRoundCheck, UserRoundX, X } from 'lucide-react-native/icons';
import * as AsyncStore from "../../../AsyncStore";
import { useDispatch } from 'react-redux';
import { handleReloadJobs, withdrawApplication } from '../../../Redux/slices/homeSlice';

const formatAppliedDate = (timestamp?: string | null) => {
    if (!timestamp) {
        return 'Applied recently';
    }

    const appliedDate = new Date(timestamp);
    if (Number.isNaN(appliedDate.getTime())) {
        return 'Applied recently';
    }

    const today = new Date();
    const appliedDay = new Date(appliedDate.getFullYear(), appliedDate.getMonth(), appliedDate.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const daysAgo = Math.floor((todayDay.getTime() - appliedDay.getTime()) / (1000 * 60 * 60 * 24));

    if (daysAgo <= 0) {
        return 'Applied today';
    }
    if (daysAgo === 1) {
        return 'Applied yesterday';
    }
    return `Applied ${daysAgo} days ago`;
};


interface WithdrawApplicationModalProps {
    visible: boolean;
    application?: any;
    onClose: () => void;
    onWithdraw?: (applicationId?: string) => void;
}

const WithdrawApplicationModal: React.FC<WithdrawApplicationModalProps> = ({
    visible,
    application,
    onClose,
    onWithdraw,
}) => {
    const dispatch = useDispatch();
    const job = application;
    const applicationDiaplayId = application?.display_id ?? '—';
    const companyName = job?.job?.company?.name.charAt(0).toUpperCase()
    const status = application?.status
    const normalizedStatus = String(status ?? '').trim().toLowerCase().replace(/[_-]/g, ' ');
    const isReviewing = ['reviewing', 'review', 'under review'].includes(normalizedStatus);
    const statusBadgeColor = normalizedStatus === 'shortlisted' ? '#9810FA'
        : normalizedStatus === 'rejected' ? '#DC2626'
            : normalizedStatus === 'hired' ? '#16A34A'
                : isReviewing ? '#165DFC' : '#AD7900';
    const employerReviewedSatatus = application?.viewed_by_employer
    const jobDescription = application?.job?.description ?? 'No job description is available for this application.';
    const applicationId = application?.id ?? '';
    const handleWithdrawApplication = async () => {
        try {
            Alert.alert(
                'Withdraw Application',
                'Are you sure you want to withdraw your application?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Withdraw',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                const userId = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
                                if (userId) {
                                    const resultId = userId.replace(/"/g, '');
                                    await dispatch(withdrawApplication({ applicationId, userId: resultId }) as any);
                                    await dispatch(handleReloadJobs(true) as any);
                                }
                                onClose();
                            } catch (error) {
                                console.log('Error deleting profile photo:', error);
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Failed to withdraw application:', error);
        }
    }

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Job Details</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
                            <X color="#687082" size={17} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.jobHeader}>
                            <View style={styles.companyLogo}>
                                <Text style={styles.companyInitial}>{companyName}</Text>
                            </View>
                            <View style={styles.jobTitleBlock}>
                                <Text style={styles.jobTitle}>{job?.job?.title ?? 'Job Title'}</Text>
                                <Text style={styles.companyText}>Info · {job?.job?.location}</Text>
                            </View>
                        </View>

                        <View style={styles.statusRow}>
                            <Text style={styles.appliedDate}>{formatAppliedDate(application?.applied_at ?? application?.created_at)}</Text>
                            <View style={[
                                styles.statusBadge,
                                normalizedStatus === 'shortlisted' && styles.shortlistedStatusBadge,
                                normalizedStatus === 'rejected' && styles.rejectedStatusBadge,
                                normalizedStatus === 'hired' && styles.hiredStatusBadge,
                                isReviewing && styles.reviewingStatusBadge,
                            ]}>
                                {normalizedStatus === 'pending' ? <Clock3 color={statusBadgeColor} size={12} />
                                    : normalizedStatus === 'shortlisted' ? <UserRoundCheck color={statusBadgeColor} size={12} />
                                        : normalizedStatus === 'rejected' ? <UserRoundX color={statusBadgeColor} size={12} />
                                            : normalizedStatus === 'hired' ? <CircleCheck color={statusBadgeColor} size={12} />
                                                : isReviewing ? <Eye color={statusBadgeColor} size={12} /> : null}
                                <Text style={[styles.statusText, { color: statusBadgeColor }]}>{status || 'Pending'}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdrawApplication} activeOpacity={0.8}>
                            <X color="#D60000" size={15} strokeWidth={1.8} />
                            <Text style={styles.withdrawButtonText}>Withdraw Application</Text>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>Application Details</Text>
                        <View style={styles.applicationCard}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Application ID</Text>
                                <Text style={styles.detailValue}>{applicationDiaplayId ?? '—'}</Text>
                            </View>
                            {/* <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Employer Reviewed</Text>
                                <Text style={styles.detailValue}>{employerReviewedSatatus ? 'Yes' : 'Not yet'}</Text>
                            </View> */}
                        </View>

                        <Text style={styles.sectionTitle}>Job Description</Text>
                        <Text style={styles.description}>
                            {jobDescription}
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default WithdrawApplicationModal;

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.55)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 14, borderTopRightRadius: 14, maxHeight: '91%', minHeight: '72%', padding: 8 },
    header: { alignItems: 'center', borderBottomColor: '#E4E7EC', borderBottomWidth: 1, flexDirection: 'row', height: 47, justifyContent: 'space-between', paddingHorizontal: 12 },
    headerTitle: { color: '#111827', fontFamily: 'Geist-VariableFont_wght', fontSize: 16, fontWeight: '600' },
    closeButton: { alignItems: 'center', backgroundColor: '#F1F3F6', borderRadius: 9, height: 23, justifyContent: 'center', width: 23 },
    content: { padding: 12, paddingBottom: 36 },
    jobHeader: { alignItems: 'center', flexDirection: 'row', marginTop: 1 },
    companyLogo: { alignItems: 'center', backgroundColor: '#F0F2F5', borderRadius: 8, height: 35, justifyContent: 'center', width: 35 },
    companyInitial: { color: '#4B5563', fontFamily: 'Geist-VariableFont_wght', fontSize: 16, fontWeight: '500' },
    jobTitleBlock: { marginLeft: 10 },
    jobTitle: { color: '#111827', fontFamily: 'Geist-VariableFont_wght', fontSize: 16, fontWeight: '600' },
    companyText: { color: '#4B5563', fontFamily: 'Geist-VariableFont_wght', fontSize: 13, marginTop: 2 },
    statusRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    appliedDate: { color: '#697386', fontFamily: 'Geist-VariableFont_wght', fontSize: 12 },
    statusBadge: { alignItems: 'center', backgroundColor: '#FFF8E5', borderColor: '#FCD34D', borderRadius: 12, borderWidth: 1, flexDirection: 'row', gap: 5, paddingHorizontal: 8, paddingVertical: 3 },
    shortlistedStatusBadge: { backgroundColor: '#FAF5FF', borderColor: '#D8B4FE' },
    rejectedStatusBadge: { backgroundColor: '#FFF1F2', borderColor: '#FDA4AF' },
    hiredStatusBadge: { backgroundColor: '#ECFDF3', borderColor: '#86EFAC' },
    reviewingStatusBadge: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
    statusText: { fontFamily: 'Geist-VariableFont_wght', fontSize: 11, fontWeight: '500', textTransform: 'capitalize' },
    withdrawButton: { alignItems: 'center', backgroundColor: '#FDEBEC', borderRadius: 10, flexDirection: 'row', height: 45, justifyContent: 'center', marginTop: 18 },
    withdrawButtonText: { color: '#D60000', fontFamily: 'Geist-VariableFont_wght', fontSize: 14, fontWeight: '500', marginLeft: 7 },
    sectionTitle: { color: '#111827', fontFamily: 'Geist-VariableFont_wght', fontSize: 14, fontWeight: '600', marginTop: 21, marginBottom: 9, paddingHorizontal: 10, paddingVertical: 6 },
    applicationCard: { backgroundColor: '#F6F8FB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
    detailLabel: { color: '#4B5563', fontFamily: 'Geist-VariableFont_wght', fontSize: 12, paddingHorizontal: 10, paddingVertical: 6 },
    detailValue: { color: '#111827', fontFamily: 'Geist-VariableFont_wght', fontSize: 12, fontWeight: '500', paddingHorizontal: 10, paddingVertical: 6 },
    description: { color: '#283548', fontFamily: 'Geist-VariableFont_wght', fontSize: 13, lineHeight: 19, paddingHorizontal: 10, },
});