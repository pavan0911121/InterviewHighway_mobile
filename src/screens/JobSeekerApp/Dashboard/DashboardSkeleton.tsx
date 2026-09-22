import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Skeleton from "react-native-reanimated-skeleton";

interface DashboardSkeletonProps {
    tabs?: boolean;
    jobs?: boolean;
    jobDetails?: boolean;
    applyJob?: boolean;
}

const DashboardSkeleton = ({ tabs = false, jobDetails = false, applyJob = false, jobs = !tabs && !jobDetails && !applyJob }: DashboardSkeletonProps) => {
    return (
        <View
            style={[styles.container, (jobs || jobDetails || applyJob) && styles.expanded]}
            accessible
            accessibilityLabel={applyJob ? 'Loading job application' : jobDetails ? 'Loading job details' : tabs ? (jobs ? 'Loading tabs and jobs' : 'Loading tabs') : 'Loading jobs'}
            accessibilityState={{ busy: true }}
        >
            {tabs && (
                <View style={styles.tabs}>
                    <Skeleton
                        containerStyle={styles.tabRow}
                        isLoading={true}
                        animationDirection="horizontalRight"
                        boneColor="#F3F4F6"
                        highlightColor="#FAFAFB"
                        layout={Array.from({ length: 3 }, (_, index) => ({
                            key: `tab-${index}`,
                            width: '31%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            children: [
                                { key: `label-${index}`, width: '68%', height: 18, borderRadius: 3 },
                                { key: `badge-${index}`, width: 22, height: 22, borderRadius: 11, marginLeft: 6 },
                            ],
                        }))}
                    />
                </View>
            )}
            {applyJob && (
                <ScrollView
                    style={styles.expanded}
                    contentContainerStyle={styles.applyJobContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Skeleton
                        containerStyle={styles.jobDetailsLayout}
                        isLoading={true}
                        animationDirection="horizontalRight"
                        boneColor="#F3F4F6"
                        highlightColor="#FAFAFB"
                        layout={[
                            { key: 'application-summary', width: '100%', height: 165, borderRadius: 12, marginBottom: 13 },
                            { key: 'application-form', width: '100%', height: 529, borderRadius: 12 },
                        ]}
                    />
                </ScrollView>
            )}
            {jobDetails && (
                <ScrollView
                    style={styles.expanded}
                    contentContainerStyle={styles.jobDetailsContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Skeleton
                        containerStyle={styles.jobDetailsLayout}
                        isLoading={true}
                        animationDirection="horizontalRight"
                        boneColor="#F3F4F6"
                        highlightColor="#FAFAFB"
                        layout={[
                            {
                                key: 'job-header',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 15,
                                children: [
                                    { key: 'job-logo', width: 42, height: 42, borderRadius: 8 },
                                    {
                                        key: 'job-heading',
                                        flex: 1,
                                        marginLeft: 10,
                                        children: [
                                            { key: 'job-title', width: '78%', height: 18, borderRadius: 3, marginBottom: 3 },
                                            {
                                                key: 'job-meta',
                                                flexDirection: 'row',
                                                children: [
                                                    { key: 'job-company', width: '36%', height: 18, borderRadius: 3, marginRight: 4 },
                                                    { key: 'job-location', width: '36%', height: 18, borderRadius: 3 },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                key: 'apply-actions',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 11,
                                children: [
                                    { key: 'quick-apply', width: '49%', height: 44, borderRadius: 10 },
                                    { key: 'apply-now', width: '49%', height: 44, borderRadius: 10 },
                                ],
                            },
                            { key: 'save-job', width: '100%', height: 44, borderRadius: 10, marginBottom: 44 },
                            { key: 'description', width: '100%', height: 135, borderRadius: 12, marginBottom: 44 },
                            { key: 'requirements', width: '100%', height: 135, borderRadius: 12 },
                        ]}
                    />
                </ScrollView>
            )}
            {jobs && (
                <ScrollView
                    style={styles.expanded}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {Array.from({ length: 5 }, (_, index) => (
                        <View key={index} style={styles.card}>
                            <Skeleton
                                containerStyle={styles.row}
                                isLoading={true}
                                animationDirection="horizontalRight"
                                boneColor="#F3F4F6"
                                highlightColor="#FAFAFB"
                                layout={[
                                    { key: 'logo', width: 54, height: 54, borderRadius: 8 },
                                    {
                                        key: 'details',
                                        flex: 1,
                                        marginLeft: 10,
                                        children: [
                                            { key: 'title', width: '80%', height: 18, borderRadius: 3, marginBottom: 3 },
                                            { key: 'company', width: '41%', height: 18, borderRadius: 3, marginBottom: 3 },
                                            { key: 'location', width: '41%', height: 18, borderRadius: 3 },
                                        ],
                                    },
                                ]}
                            />
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default DashboardSkeleton;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    expanded: {
        flex: 1,
    },
    applyJobContent: {
        paddingHorizontal: 18,
        paddingTop: 40,
        paddingBottom: 18,
    },
    jobDetailsContent: {
        paddingHorizontal: 9,
        paddingTop: 19,
        paddingBottom: 14,
    },
    jobDetailsLayout: {
        width: '100%',
    },
    tabs: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    tabRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 28,
        gap: 16,
    },
    card: {
        borderWidth: 1,
        borderColor: '#EAEBEE',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
});