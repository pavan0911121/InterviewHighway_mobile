import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    ArrowRight,
    Check,
    Clock3,
    LayoutGrid,
    Lightbulb,
    ListChecks,
    Search,
    Star,
} from 'lucide-react-native/icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ApplicationSuccessScreenProps {
    applicationData?: any;
    onGoToDashboard?: () => void;
    onBrowseMoreJobs?: () => void;
    onStartPreparing?: () => void;
}

const STEPS = [
    {
        title: 'Application Review',
        description: 'The employer will review your application within 3-5 business days',
    },
    {
        title: 'Initial Screening',
        description: "If shortlisted, you'll receive an email for the next steps",
    },
    {
        title: 'Interview Process',
        description: 'Prepare for technical rounds and discussions with the team',
    },
];

const ApplicationSuccessScreen = ({
    applicationData,
    onGoToDashboard,
    onBrowseMoreJobs,
    onStartPreparing,
}: ApplicationSuccessScreenProps) => {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.successIconWrapper}>
                    <View style={styles.successIconOuter}>
                        <View style={styles.successIconInner}>
                            <Check size={30} color="#FFFFFF" strokeWidth={3} />
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Application{`\n`}Submitted{`\n`}Successfully!</Text>
                    <Text style={styles.subtitle}>
                        Your application for{' '}
                        <Text style={styles.subtitleHighlight}>{applicationData?.jobTitle}</Text> at{' '}
                        <Text style={styles.subtitleHighlight}>{applicationData?.companyName}</Text> has been
                        received. We've notified the employer about your application.
                    </Text>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>APPLICATION ID</Text>
                        <Text style={styles.summaryValueLink}>{applicationData?.applicationId}</Text>

                        <Text style={[styles.summaryLabel, styles.summarySpacing]}>APPLIED ON</Text>
                        <Text style={styles.summaryValue}>{applicationData?.appliedOn}</Text>

                        <Text style={[styles.summaryLabel, styles.summarySpacing]}>STATUS</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusBadgeText}>{applicationData?.status || 'Under Review'}</Text>
                        </View>
                    </View>

                    <View style={styles.nextStepsCard}>
                        <View style={styles.nextStepsHeader}>
                            <View style={styles.nextStepsIcon}>
                                <ListChecks size={20} color="#FFFFFF" />
                            </View>
                            <Text style={styles.nextStepsTitle}>What Happens{`\n`}Next?</Text>
                        </View>

                        {STEPS.map((step, index) => (
                            <View style={styles.stepRow} key={step.title}>
                                <View style={styles.stepNumberCircle}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <View style={styles.stepTextBlock}>
                                    <Text style={styles.stepTitle}>{step.title}</Text>
                                    <Text style={styles.stepDescription}>{step.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.dashboardButton} activeOpacity={0.85} onPress={onGoToDashboard}>
                        <LayoutGrid size={18} color="#FFFFFF" />
                        <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.browseButton} activeOpacity={0.85} onPress={onBrowseMoreJobs}>
                        <Search size={16} color="#181818" />
                        <Text style={styles.browseButtonText}>Browse More Jobs</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.recommendedCard}>
                    <View style={styles.recommendedHeader}>
                        <View style={styles.recommendedIcon}>
                            <Lightbulb size={20} color="#FFFFFF" />
                        </View>
                        <View style={styles.recommendedBadge}>
                            <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
                        </View>
                    </View>

                    <Text style={styles.recommendedTitle}>Ace Your Interview{`\n`}Preparation</Text>
                    <Text style={styles.recommendedDescription}>
                        Prepare for your upcoming interview with our comprehensive interview preparation course.
                        Cover advanced topics and common interview questions specific to your field.
                    </Text>

                    <View style={styles.recommendedMetaRow}>
                        <View style={styles.recommendedMetaItem}>
                            <Star size={13} color="#F59E0B" fill="#F59E0B" />
                            <Text style={styles.recommendedMetaText}>4.8/5</Text>
                        </View>
                        <View style={styles.recommendedMetaItem}>
                            <Clock3 size={13} color="#797979" />
                            <Text style={styles.recommendedMetaText}>12 hours</Text>
                        </View>
                        <Text style={styles.recommendedMetaText}>Advanced</Text>
                    </View>

                    <TouchableOpacity style={styles.prepareButton} activeOpacity={0.85} onPress={onStartPreparing}>
                        <Text style={styles.prepareButtonText}>Start Preparing{`\n`}Now</Text>
                        <ArrowRight size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ApplicationSuccessScreen;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
    scrollView: { flex: 1 },
    content: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },
    successIconWrapper: { marginBottom: 20 },
    successIconOuter: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#D9F7E4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    successIconInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#16A34A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        lineHeight: 32,
        fontWeight: '800',
        color: '#101828',
        textAlign: 'center',
        fontFamily: 'Geist-VariableFont_wght',
    },
    subtitle: {
        marginTop: 14,
        fontSize: 14,
        lineHeight: 21,
        color: '#4A5565',
        textAlign: 'center',
        fontFamily: 'Geist-VariableFont_wght',
    },
    subtitleHighlight: {
        color: '#165DFC',
        fontWeight: '700',
    },
    summaryCard: {
        width: '100%',
        marginTop: 20,
        backgroundColor: '#F8F9FB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EAEBEE',
        padding: 18,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 11,
        letterSpacing: 0.5,
        color: '#797979',
        fontFamily: 'Geist-VariableFont_wght',
        fontWeight: '600',
    },
    summarySpacing: { marginTop: 16 },
    summaryValue: {
        marginTop: 6,
        fontSize: 15,
        fontWeight: '700',
        color: '#181818',
        fontFamily: 'Geist-VariableFont_wght',
        textAlign: 'center',
    },
    summaryValueLink: {
        marginTop: 6,
        fontSize: 15,
        fontWeight: '700',
        color: '#165DFC',
        fontFamily: 'Geist-VariableFont_wght',
    },
    statusBadge: {
        marginTop: 6,
        backgroundColor: '#DCFCE7',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 5,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#16A34A',
        fontFamily: 'Geist-VariableFont_wght',
    },
    nextStepsCard: {
        width: '100%',
        marginTop: 20,
        backgroundColor: '#DFEDFF',
        borderRadius: 14,
        padding: 20,
    },
    nextStepsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
    },
    nextStepsIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#165DFC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextStepsTitle: {
        fontSize: 17,
        lineHeight: 21,
        fontWeight: '700',
        color: '#101828',
        fontFamily: 'Geist-VariableFont_wght',
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    stepNumberCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#165DFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    stepNumberText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: 'Geist-VariableFont_wght',
    },
    stepTextBlock: { flex: 1 },
    stepTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#101828',
        fontFamily: 'Geist-VariableFont_wght',
    },
    stepDescription: {
        marginTop: 3,
        fontSize: 12,
        lineHeight: 17,
        color: '#4A5565',
        fontFamily: 'Geist-VariableFont_wght',
    },
    dashboardButton: {
        width: '100%',
        marginTop: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#165DFC',
        borderRadius: 10,
        paddingVertical: 15,
    },
    dashboardButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: 'Geist-VariableFont_wght',
    },
    browseButton: {
        width: '100%',
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        paddingVertical: 15,
    },
    browseButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#181818',
        fontFamily: 'Geist-VariableFont_wght',
    },
    recommendedCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 22,
    },
    recommendedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    recommendedIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F97316',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recommendedBadge: {
        backgroundColor: '#FFE9D5',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    recommendedBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.4,
        color: '#EA7B17',
        fontFamily: 'Geist-VariableFont_wght',
    },
    recommendedTitle: {
        fontSize: 19,
        lineHeight: 24,
        fontWeight: '700',
        color: '#101828',
        fontFamily: 'Geist-VariableFont_wght',
    },
    recommendedDescription: {
        marginTop: 10,
        fontSize: 13,
        lineHeight: 20,
        color: '#4A5565',
        fontFamily: 'Geist-VariableFont_wght',
    },
    recommendedMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 16,
    },
    recommendedMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    recommendedMetaText: {
        fontSize: 12,
        color: '#4A5565',
        fontFamily: 'Geist-VariableFont_wght',
    },
    prepareButton: {
        marginTop: 18,
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F97316',
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    prepareButtonText: {
        fontSize: 13,
        lineHeight: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'right',
        fontFamily: 'Geist-VariableFont_wght',
    },
});