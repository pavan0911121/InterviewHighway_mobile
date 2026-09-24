import { Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { checkCandidateEducation, checkCandidateSkills, checkCandidateWork, checkCandidateVideo } from '../../../Redux/slices/jobPostings'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ArrowLeft, CalendarDays, Download, UserRound, Mail, Phone, MapPin, BriefcaseBusiness, BookOpen, Globe, Sparkles, BadgeCheck, MoveLeft, User, Award, Briefcase, GraduationCap, Link } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { getCandidateDetails } from '../../../Redux/slices/employerApplicationsSlice'

const CandidateProfile = ({ route }: any) => {
    const { candidateData, candidateId, email } = route.params;
    const dispatch = useDispatch();

    const navigation = useNavigation()
    const selector = useSelector((state: any) => state?.employerApplications);
    const jobPostingsSelector = useSelector((state: any) => state.jobPostings);
    useEffect(() => {
        // You can dispatch an action here to fetch candidate details if needed
        // For example: dispatch(fetchCandidateDetails(candidateData.id));
        handleCandidateDtailsApi(candidateId); // Call the function to fetch candidate details
    }, [candidateId]);
    const handleCandidateDtailsApi = async (candidateId?: string) => {
        try {
            if (!candidateId) return;
          await (dispatch as any)(getCandidateDetails(candidateId));
          await (dispatch as any)(checkCandidateSkills({ candidateId }));
          await (dispatch as any)(checkCandidateWork({ candidateId }));
          await (dispatch as any)(checkCandidateEducation({ candidateId }));
          await (dispatch as any)(checkCandidateVideo({ candidateId })); 
            // await dispatch(getCandidateDetails(candidateId));
        } catch (error) {
            console.error('Error fetching candidate details:', error);
        }
    }
    const skills = Array.isArray(jobPostingsSelector?.candidateSkillsData)
        ? jobPostingsSelector.candidateSkillsData
        : [];
    const workExperience = Array.isArray(jobPostingsSelector?.candidateWorkExperienceData)
        ? jobPostingsSelector.candidateWorkExperienceData
        : [];
    const education = Array.isArray(jobPostingsSelector?.candidateEducationData?.education)
        ? jobPostingsSelector.candidateEducationData.education
        : [];
    const video = jobPostingsSelector?.candidateVideoData;
    const linkedIn = selector?.candidateData?.[0]?.linkedin_url
        || selector?.candidateData?.linkedin_url
        || candidateData?.candidate?.linkedin_url;
        console.log(selector, jobPostingsSelector, "selectors for candidate details");
    return (
        <SafeAreaView style={styles.container}>
            {selector?.candidateData?.length > 0 && (
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                        <MoveLeft size={20} color={'#000'} />
                        <Text style={styles.backText}> Go Back</Text>
                    </TouchableOpacity>
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Candidate Profile</Text>

                        <Text style={styles.subtitleRow}>
                            <Text style={styles.subtitleLabel}>Read-only view</Text>
                            <Text style={styles.subtitleDot}> • </Text>
                            <Text style={styles.subtitleEmail}>{'\n'}{candidateData?.candidate?.email || email}</Text>
                        </Text>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.downloadButton}>
                                <Download size={18} color="#fff" />
                                <Text style={styles.downloadButtonText}>Download PDF</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.gaugeWrapper}>
                            <View style={styles.gaugeRing}>
                                <View style={styles.gaugeInner}>
                                    <View style={styles.gaugeArc}>
                                        <View style={styles.gaugeTicks} />
                                        <View style={styles.gaugeNeedle} />
                                        <View style={styles.gaugeCenterDot} />
                                    </View>
                                    <Text style={styles.gaugePercent}>{candidateData?.profile_completion_percentage || 0}%</Text>
                                    <Text style={styles.gaugeLabel}>PROFILE</Text>
                                    <Text style={styles.gaugeStrength}>STRENGTH</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}><User size={15} color="#111827" /> Personal Information</Text>

                            <View style={styles.infoItem}>
                                <View style={styles.infoIconWrapper}>
                                    <User size={15} color="#111827" />
                                    <Text style={styles.label}>Full Name</Text>
                                </View>
                                <Text style={styles.value}>{selector?.candidateData[0]?.name}</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <View style={styles.infoIconWrapper}>
                                    <Mail size={15} color="#111827" />
                                    <Text style={styles.label}>Email</Text>
                                </View>
                                <Text style={styles.value}>{candidateData?.candidate?.email || email}</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <View style={styles.infoIconWrapper}>
                                    <Phone size={15} color="#111827" />
                                    <Text style={styles.label}>Phone</Text>
                                </View>
                                <Text style={styles.value}>{selector?.candidateData[0]?.phone}</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <View style={styles.infoIconWrapper}>
                                    <MapPin size={15} color="#111827" />
                                    <Text style={styles.label}>Location</Text>
                                </View>
                                <Text style={styles.value}>{selector?.candidateData[0]?.location}</Text>
                            </View>

                            <View style={[styles.infoItem, styles.bioItem]}>
                                <Text style={styles.label}>Bio</Text>
                                <Text style={styles.value}>{selector?.candidateData[0]?.bio}</Text>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.infoIconWrapper}>
                                <Award size={20} color="#111827" />
                                <Text style={styles.sectionTitle}>Skills & Expertise</Text>
                            </View>
                            {skills.length > 0 ? skills.map((skill: any, index: number) => {
                                const proficiency = Math.max(0, Math.min(5, Number(skill?.proficiency_level) || 0));
                                const experience = Number(skill?.years_of_experience) || 0;

                                return (
                                    <View key={skill?.id || `${skill?.skills?.name}-${index}`} style={[styles.skillItem, index > 0 && styles.skillItemBorder]}>
                                        <View style={styles.skillHeader}>
                                            <Text style={styles.skillName}>{skill?.skills?.name || 'Unnamed skill'}</Text>
                                            <Text style={styles.skillScore}>{proficiency}/5</Text>
                                        </View>
                                        <View style={styles.skillFooter}>
                                            <Text style={styles.skillExperience}>{experience} {experience === 1 ? 'year' : 'years'} experience</Text>
                                            <View style={styles.skillProgressTrack}>
                                                <View style={[styles.skillProgressFill, { width: `${proficiency * 20}%` }]} />
                                            </View>
                                        </View>
                                    </View>
                                );
                            }) : <Text style={styles.emptyText}>No skills added yet.</Text>}
                        </View>

                        <View style={styles.card}>
                            <View style={styles.infoIconWrapper}>
                                <Briefcase size={20} color="#111827" />
                                <Text style={styles.sectionTitle}> Work Experience</Text>
                            </View>
                            {workExperience.length > 0 ? workExperience.map((experience: any, index: number) => {
                                const formatDate = (date?: string) => {
                                    if (!date) return 'Present';
                                    const parsedDate = new Date(`${date}T00:00:00`);
                                    return Number.isNaN(parsedDate.getTime())
                                        ? date
                                        : parsedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                };

                                return (
                                    <View key={experience?.id || `${experience?.job_title}-${index}`} style={[styles.experienceItem, index > 0 && styles.experienceItemBorder]}>
                                        <Text style={styles.experienceTitle}>{experience?.job_title || 'Untitled role'}</Text>
                                        <Text style={styles.experienceCompany}><BriefcaseBusiness size={13} color="#657080" /> {experience?.company_name || 'Company not specified'}</Text>
                                        <Text style={styles.experienceDates}><CalendarDays size={13} color="#657080" /> {formatDate(experience?.start_date)} - {formatDate(experience?.end_date)}</Text>
                                    </View>
                                );
                            }) : <Text style={styles.emptyText}>No work experience added yet.</Text>}
                        </View>

                        <View style={styles.card}>
                            <View style={styles.infoIconWrapper}>
                                <GraduationCap size={20} color="#111827" />
                                <Text style={styles.sectionTitle}> Education</Text>
                            </View>
                            {education.length > 0 ? education.map((item: any, index: number) => {
                                const formatDate = (date?: string | null) => {
                                    if (!date) return 'Present';
                                    const parsedDate = new Date(`${date}T00:00:00`);
                                    return Number.isNaN(parsedDate.getTime())
                                        ? date
                                        : parsedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                };

                                return (
                                    <View key={item?.id || `${item?.degree}-${index}`} style={[styles.educationItem, index > 0 && styles.educationItemBorder]}>
                                        <View style={styles.educationHeader}>
                                            <Text style={styles.educationDegree}>{item?.degree || 'Education'}</Text>
                                            {!!item?.grade && <Text style={styles.educationGrade}>{item.grade}</Text>}
                                        </View>
                                        {!!item?.institution_name && <Text style={styles.educationInstitution}>{item.institution_name}</Text>}
                                        {!!item?.field_of_study && <Text style={styles.educationField}>{item.field_of_study}</Text>}
                                        <Text style={styles.educationDates}><CalendarDays size={13} color="#657080" /> {formatDate(item?.start_date)} - {formatDate(item?.end_date)}</Text>
                                        {!!item?.description && <Text style={styles.educationDescription}>{item.description}</Text>}
                                    </View>
                                );
                            }) : <Text style={styles.emptyText}>No education history added yet.</Text>}
                        </View>

                        <View style={styles.card}>
                            <View style={styles.infoIconWrapper}>
                                <Link size={20} color="#111827" />
                                <Text style={styles.sectionTitle}> Social Links</Text>
                            </View>
                            {linkedIn ? (
                                <Pressable style={styles.socialLink} onPress={() =>  Linking.openURL(linkedIn) }>
                                    <Link size={19} color="#155EEF" />
                                    <View style={styles.socialLinkContent}>
                                        <Text style={styles.socialLinkTitle}>LinkedIn</Text>
                                        <Text numberOfLines={1} style={styles.socialLinkUrl}>{linkedIn}</Text>
                                    </View>
                                </Pressable>
                            ) : <Text style={styles.emptyText}>No social links added yet.</Text>}
                        </View>

                        <Text style={styles.footerText}>Profile created on 23 March 2026</Text>
                    </View>
                </ScrollView>)}
        </SafeAreaView>
    )
}

export default CandidateProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F5F6',
    },
    back: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginVertical: 12,
        marginHorizontal: 18,
    },
    backText: {
        fontFamily: 'Geist-VariableFont_wght',
        fontSize: 14,
        color: '#000000',
    },
    innerContainer: {
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 28,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#111827',
        fontFamily: 'Geist-VariableFont_wght',
        marginBottom: 6,
    },
    subtitleRow: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Geist-VariableFont_wght',
        marginBottom: 18,
    },
    subtitleLabel: {
        fontWeight: '500',
        color: '#6B7280',
    },
    subtitleDot: {
        color: '#6B7280',
    },
    subtitleEmail: {
        color: '#4B5563',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#F9FAFB',
        minWidth: 120,
        gap: 8,
    },
    backButtonText: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Geist-VariableFont_wght',
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#111827',
        minWidth: 168,
        gap: 8,
    },
    downloadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Geist-VariableFont_wght',
    },
    gaugeWrapper: {
        alignItems: 'center',
        marginBottom: 26,
    },
    gaugeRing: {
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 6,
        borderColor: '#111827',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    gaugeInner: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 6,
        borderColor: '#111827',
    },
    gaugeArc: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 8,
        borderLeftColor: '#20C997',
        borderTopColor: '#20C997',
        borderRightColor: '#374151',
        borderBottomColor: '#374151',
        transform: [{ rotate: '120deg' }],
        opacity: 0.9,
    },
    gaugeTicks: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        transform: [{ rotate: '10deg' }],
    },
    gaugeNeedle: {
        position: 'absolute',
        width: 2,
        height: 86,
        backgroundColor: '#F59E0B',
        borderRadius: 2,
        transform: [{ rotate: '90deg' }],
        top: 28,
        left: 109,
    },
    gaugeCenterDot: {
        position: 'absolute',
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#F3F4F6',
        borderWidth: 3,
        borderColor: '#111827',
        top: 102,
        left: 101,
    },
    gaugePercent: {
        fontSize: 30,
        fontWeight: '700',
        color: '#F9FAFB',
        fontFamily: 'Geist-VariableFont_wght',
        marginTop: 24,
    },
    gaugeLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#D1D5DB',
        letterSpacing: 1,
        fontFamily: 'Geist-VariableFont_wght',
        marginTop: 4,
    },
    gaugeStrength: {
        fontSize: 11,
        color: '#D1D5DB',
        fontFamily: 'Geist-VariableFont_wght',
        letterSpacing: 1,
        marginTop: 2,
    },
    card: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 18,
        paddingVertical: 18,
        marginBottom: 18,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        fontFamily: 'Geist-VariableFont_wght',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoItem: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 14,
        marginTop: 14,
    },
    infoIconWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    skillItem: {
        paddingTop: 2,
    },
    skillItemBorder: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginTop: 14,
        paddingTop: 14,
    },
    skillHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    skillName: {
        color: '#111827',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Geist-VariableFont_wght',
    },
    skillScore: {
        color: '#111827',
        fontSize: 10,
        borderRadius: 7,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 7,
        paddingVertical: 4,
        fontFamily: 'Geist-VariableFont_wght',
    },
    skillFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 7,
    },
    skillExperience: {
        color: '#374151',
        fontSize: 11,
        fontFamily: 'Geist-VariableFont_wght',
    },
    skillProgressTrack: {
        flex: 1,
        height: 6,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
        overflow: 'hidden',
    },
    skillProgressFill: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: '#155EEF',
    },
    experienceItem: {
        paddingTop: 2,
    },
    experienceItemBorder: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginTop: 16,
        paddingTop: 16,
    },
    experienceTitle: {
        color: '#111827',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Geist-VariableFont_wght',
    },
    experienceCompany: {
        flexDirection: 'row',
        alignItems: 'center',
        color: '#253044',
        fontSize: 12,
        marginTop: 8,
        fontFamily: 'Geist-VariableFont_wght',
    },
    experienceDates: {
        flexDirection: 'row',
        alignItems: 'center',
        color: '#657080',
        fontSize: 11,
        marginTop: 7,
        fontFamily: 'Geist-VariableFont_wght',
    },
    educationItem: {
        paddingTop: 2,
    },
    educationItemBorder: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginTop: 16,
        paddingTop: 16,
    },
    educationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    educationDegree: {
        color: '#111827',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Geist-VariableFont_wght',
    },
    educationGrade: {
        color: '#374151',
        fontSize: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 3,
        fontFamily: 'Geist-VariableFont_wght',
    },
    educationInstitution: {
        color: '#253044',
        fontSize: 12,
        marginTop: 9,
        fontFamily: 'Geist-VariableFont_wght',
    },
    educationField: {
        color: '#657080',
        fontSize: 11,
        marginTop: 6,
        fontFamily: 'Geist-VariableFont_wght',
    },
    educationDates: {
        flexDirection: 'row',
        alignItems: 'center',
        color: '#657080',
        fontSize: 11,
        marginTop: 7,
        fontFamily: 'Geist-VariableFont_wght',
    },
    educationDescription: {
        color: '#253044',
        fontSize: 12,
        marginTop: 8,
        fontFamily: 'Geist-VariableFont_wght',
    },
    socialLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#DDE1E6',
        borderRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 9,
    },
    socialLinkContent: {
        flex: 1,
    },
    socialLinkTitle: {
        color: '#111827',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Geist-VariableFont_wght',
    },
    socialLinkUrl: {
        color: '#657080',
        fontSize: 10,
        marginTop: 3,
        fontFamily: 'Geist-VariableFont_wght',
    },
    bioItem: {
        borderBottomWidth: 0,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        fontFamily: 'Geist-VariableFont_wght',
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        fontFamily: 'Geist-VariableFont_wght',
        lineHeight: 28,
        textTransform: 'capitalize',
    },
    emptyText: {
        fontSize: 16,
        color: '#4B5563',
        fontFamily: 'Geist-VariableFont_wght',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Geist-VariableFont_wght',
        marginTop: 8,
        marginBottom: 8,
    },
})