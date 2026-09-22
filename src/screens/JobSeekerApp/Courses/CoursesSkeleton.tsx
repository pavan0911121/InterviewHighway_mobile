import { ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import Skeleton from "react-native-reanimated-skeleton";

interface CoursesSkeletonProps {
    courses?: boolean;
    courseDetails?: boolean;
    lesson?: boolean;
}

const CoursesSkeleton = ({ courseDetails = false, lesson = false, courses = !courseDetails && !lesson }: CoursesSkeletonProps) => {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, courseDetails && styles.detailsContent, lesson && styles.lessonContent]}
            showsVerticalScrollIndicator={false}
            accessible
            accessibilityLabel={lesson ? 'Loading lesson' : courseDetails ? (courses ? 'Loading courses and course details' : 'Loading course details') : 'Loading courses'}
            accessibilityState={{ busy: true }}
        >
            {lesson && (
                <Skeleton
                    containerStyle={styles.layout}
                    isLoading={true}
                    animationDirection="horizontalRight"
                    boneColor="#F3F4F6"
                    highlightColor="#FAFAFB"
                    layout={[
                        { key: 'lesson-video', width: '97%', height: 188, borderRadius: 12, alignSelf: 'center', marginBottom: 72 },
                        {
                            key: 'lesson-tabs',
                            width: '96%',
                            alignSelf: 'flex-end',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 47,
                            children: Array.from({ length: 3 }, (_, index) => ({
                                key: `lesson-tab-${index}`,
                                width: '30.5%',
                                height: 58,
                                borderRadius: 12,
                            })),
                        },
                        { key: 'lesson-progress', width: '96%', height: 10, borderRadius: 5, alignSelf: 'flex-end', marginBottom: 64 },
                        { key: 'lesson-content', width: '100%', height: 167, borderRadius: 12 },
                    ]}
                />
            )}
            {courseDetails && (
                <Skeleton
                    containerStyle={styles.layout}
                    isLoading={true}
                    animationDirection="horizontalRight"
                    boneColor="#F3F4F6"
                    highlightColor="#FAFAFB"
                    layout={[
                        { key: 'course-badge', width: '19%', height: 21, borderRadius: 11, marginBottom: 13 },
                        { key: 'course-title', width: '37%', height: 24, borderRadius: 5, marginBottom: 18 },
                        {
                            key: 'instructor',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 17,
                            children: [
                                { key: 'instructor-avatar', width: 38, height: 38, borderRadius: 19 },
                                { key: 'instructor-name', width: '51%', height: 31, borderRadius: 5, marginLeft: 7 },
                            ],
                        },
                        { key: 'course-preview', width: '100%', height: 188, borderRadius: 12, marginBottom: 14 },
                        { key: 'course-summary', width: '100%', height: 90, borderRadius: 12, marginBottom: 14 },
                        { key: 'course-description', width: '100%', height: 98, borderRadius: 12, marginBottom: 7 },
                        { key: 'course-content', width: '100%', height: 149, borderRadius: 12 },
                    ]}
                />
            )}
            {courses && (
                <Skeleton
                containerStyle={styles.layout}
                isLoading={true}
                animationDirection="horizontalRight"
                boneColor="#F3F4F6"
                highlightColor="#FAFAFB"
                layout={[
                    ...Array.from({ length: 2 }, (_, index) => ({
                        key: `grid-row-${index}`,
                        width: '100%' as const,
                        flexDirection: 'row' as const,
                        justifyContent: 'space-between' as const,
                        marginBottom: index === 0 ? 10 : 16,
                        children: [
                            { key: `left-${index}`, width: '48%' as const, height: 92, borderRadius: 9 },
                            { key: `right-${index}`, width: '48%' as const, height: 92, borderRadius: 9 },
                        ],
                    })),
                    { key: 'course-first', width: '100%', height: 164, borderRadius: 9, marginBottom: 9 },
                    { key: 'course-second', width: '100%', height: 164, borderRadius: 9 },
                ]}
                />
            )}
        </ScrollView>
    );
};

export default CoursesSkeleton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        paddingHorizontal: 15,
        paddingTop: 26,
        paddingBottom: 32,
    },
    layout: {
        width: '100%',
    },
    detailsContent: {
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 37,
        gap: 16,
    },
    lessonContent: {
        paddingHorizontal: 33,
        paddingTop: 50,
        paddingBottom: 47,
        gap: 16,
    },
});