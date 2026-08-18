import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ArrowLeft, Download, UserRound, Mail, Phone, MapPin, BriefcaseBusiness, BookOpen, Globe, Sparkles, BadgeCheck, MoveLeft } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { getCandidateDetails } from '../../../Redux/slices/employerApplicationsSlice'

const CandidateProfile = ({ route }: any) => {
    const { candidateData } = route.params;
    const dispatch = useDispatch();

    const navigation = useNavigation()
    const selector = useSelector((state: any) => state?.employerApplications);
    useEffect(() => {
        // You can dispatch an action here to fetch candidate details if needed
        // For example: dispatch(fetchCandidateDetails(candidateData.id));
        handleCandidateDtailsApi(candidateData?.user_id); // Call the function to fetch candidate details
    }, []);
    const handleCandidateDtailsApi = async (candidateId?: string) => {
        try {
            if (!candidateId) return;
            const response = await (dispatch as any)(getCandidateDetails(candidateId));
        } catch (error) {
            console.error('Error fetching candidate details:', error);
        }
    }

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
                            <Text style={styles.subtitleEmail}>{candidateData?.candidate?.email}</Text>
                        </Text>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.backButton}>
                                <ArrowLeft size={18} color="#111827" />
                                <Text style={styles.backButtonText}>Back</Text>
                            </TouchableOpacity>

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
                                    <Text style={styles.gaugePercent}>33%</Text>
                                    <Text style={styles.gaugeLabel}>PROFILE</Text>
                                    <Text style={styles.gaugeStrength}>STRENGTH</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}><UserRound size={20} color="#111827" /> Personal Information</Text>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>Full Name</Text>
                                <Text style={styles.value}>{selector?.candidateData[0]?.name}</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>Email</Text>
                                <Text style={styles.value}>{candidateData?.candidate?.email}</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>Phone</Text>
                                <Text style={styles.value}>{selector?.candidateData[0]?.phone}</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Text style={styles.label}>Location</Text>
                                <Text style={styles.value}>{selector?.candidateData[0]?.location}</Text>
                            </View>

                            <View style={[styles.infoItem, styles.bioItem]}>
                                <Text style={styles.label}>Bio</Text>
                                <Text style={styles.value}>{selector?.candidateData[0]?.bio}</Text>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}><Sparkles size={20} color="#111827" /> Skills & Expertise</Text>
                            <Text style={styles.emptyText}>No skills added yet.</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}><BriefcaseBusiness size={20} color="#111827" /> Work Experience</Text>
                            <Text style={styles.emptyText}>No work experience added yet.</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}><BookOpen size={20} color="#111827" /> Education</Text>
                            <Text style={styles.emptyText}>No education history added yet.</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}><Globe size={20} color="#111827" /> Social Links</Text>
                            <Text style={styles.emptyText}>No social links added yet.</Text>
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
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        fontFamily: 'Geist-VariableFont_wght',
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoItem: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 14,
        marginTop: 14,
    },
    bioItem: {
        borderBottomWidth: 0,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        fontFamily: 'Geist-VariableFont_wght',
        marginBottom: 6,
    },
    value: {
        fontSize: 18,
        fontWeight: '500',
        color: '#111827',
        fontFamily: 'Geist-VariableFont_wght',
        lineHeight: 28,
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