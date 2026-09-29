import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native'
import { BriefcaseBusiness, CalendarDays, ChevronDown, CheckCircle2, CircleX, Clock3, Eye, FileText, MapPin, MoveLeft, Search, UserRound, UserRoundPlus, Users, X, StickyNote, Download } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as AsyncStore from '../../../AsyncStore'
import { getApplicationsList } from '../../../Redux/slices/employerApplicationsSlice'
import { addNotesToCandidateProfile, getEmployerJobApplications, getEmployerJobData, updateApplicationStatus } from '../../../Redux/slices/jobPostings'
import { useDispatch, useSelector } from 'react-redux'

type JobApplication = {
    status?: string
}

const ApplicationStatusBadge = ({ status }: JobApplication) => {
    const normalizedStatus = status?.toLowerCase()
    const config = normalizedStatus === 'reviewing'
        ? { label: 'Under Review', color: '#155EEF', icon: <Eye size={11} color="#155EEF" />, badgeStyle: styles.reviewingBadge }
        : normalizedStatus === 'shortlisted'
            ? { label: 'Shortlisted', color: '#A020F0', icon: <UserRoundPlus size={11} color="#A020F0" />, badgeStyle: styles.shortlistedBadge }
            : normalizedStatus === 'hired'
                ? { label: 'Hired', color: '#00A63E', icon: <CheckCircle2 size={11} color="#00A63E" />, badgeStyle: styles.hiredBadge }
                : normalizedStatus === 'rejected'
                    ? { label: 'Rejected', color: '#E11D48', icon: <CircleX size={11} color="#E11D48" />, badgeStyle: styles.rejectedBadge }
                    : { label: 'Pending Review', color: '#6B7280', icon: <Clock3 size={11} color="#6B7280" />, badgeStyle: styles.pendingBadge }

    return (
        <View style={[styles.statusBadge, config.badgeStyle]}>
            {config.icon}
            <Text style={[styles.statusBadgeText, { color: config.color }]}>{config.label}</Text>
        </View>
    )
}

const ViewApplications = () => {
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const { width } = useWindowDimensions()
    const [searchQuery, setSearchQuery] = useState('')
    const dispatch = useDispatch<any>()
    const [openStatusId, setOpenStatusId] = useState<string | number | null>(null)
    const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({})
    const [notesModalVisible, setNotesModalVisible] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState<any>(null)
    const [notesContent, setNotesContent] = useState('')
    const [isSavingNotes, setIsSavingNotes] = useState(false)
    const [applications, setApplications] = useState([
        { id: '1', name: 'Test Job Seeker Two', email: 'test-jobseeker2@interviewhighway.com', applied: '2 days ago', status: 'Pending Review', new: true },
        { id: '2', name: 'Test Job Seeker One', email: 'test-jobseeker1@interviewhighway.com', applied: '3 days ago', status: 'Pending Review', new: true },
    ])

    const job = route.params?.job as { id?: string | number; title?: string; location?: string; employment_type?: string } | undefined
    const jobTitle = job?.title || 'Python dev'

    const getApplicationAge = (appliedAt?: string) => {
        if (!appliedAt) {
            return 'Date unavailable'
        }

        const appliedDate = new Date(appliedAt)
        if (Number.isNaN(appliedDate.getTime())) {
            return 'Date unavailable'
        }

        const elapsedDays = Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24))
        if (elapsedDays <= 0) {
            return 'Today'
        }

        return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`
    }


    const statusOptions = [
        { value: 'pending', label: 'Pending Review', icon: <Clock3 size={14} color="#6B7280" /> },
        { value: 'reviewing', label: 'Under Review', icon: <Eye size={14} color="#155EEF" /> },
        { value: 'shortlisted', label: 'Shortlist', icon: <UserRound size={14} color="#A020F0" /> },
        { value: 'hired', label: 'Hire Candidate', icon: <UserRound size={14} color="#00A63E" /> },
        { value: 'rejected', label: 'Reject', icon: <UserRound size={14} color="#E11D48" /> },
    ]

    const handleUpdateStatus = async (id: string | number, status: string) => {
        setOpenStatusId(null)
        try {
            const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);
            if (userLoggedInData && job?.id) {
                const parsedUserData = JSON.parse(userLoggedInData);
                const userId = parsedUserData?.id || null;
                const payload = {
                    status: status,
                    userId: userId,
                };
                console.log('Updating status for application:', { id, status, userId });
                await dispatch(updateApplicationStatus({ applicationId: String(id), body: payload })).unwrap()
                await dispatch(getEmployerJobApplications({
                    userId: userId,
                    jobId: String(job.id),
                })).unwrap()
            }
        } catch (error) {
            console.error('Failed to update status', error)
        }
        // setStatusOverrides((current) => ({ ...current, [String(id)]: status }))
        // setOpenStatusId(null)
    }


    useEffect(() => {
        handleJobApplications()
    }, [job?.id])

    const handleJobApplications = async () => {
        try {
            const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);
            if (userLoggedInData && job?.id) {
                const parsedUserData = JSON.parse(userLoggedInData);
                const userId = parsedUserData?.id || null;
                await dispatch(getEmployerJobData({
                    userId: userId,
                    jobId: String(job.id),
                })).unwrap()
                await dispatch(getEmployerJobApplications({
                    userId: userId,
                    jobId: String(job.id),
                })).unwrap()
            }
        } catch (error) {
            console.error('Failed to update job applications', error)
        }
    }
    const selector = useSelector((state: any) => state.jobPostings);
    const jobData = selector?.selectedJobData;
    const jobApplications: any[] = selector?.jobApplicationsData?.applications || [];
    const statCards = [
        { value: jobApplications.length, label: 'Total', color: '#111827', background: '#FFFFFF' },
        { value: jobApplications.filter((application) => application.status === 'pending').length, label: 'Pending', color: '#111827', background: '#FFFFFF' },
        { value: jobApplications.filter((application) => application.status === 'reviewing').length, label: 'Reviewing', color: '#0055FF', background: '#FFFFFF' },
        { value: jobApplications.filter((application) => application.status === 'shortlisted').length, label: 'Shortlisted', color: '#8B00FF', background: '#FFFFFF' },
        { value: jobApplications.filter((application) => application.status === 'rejected').length, label: 'Rejected', color: '#FF0000', background: '#FFFFFF' },
        { value: jobApplications.filter((application) => application.status === 'hired').length, label: 'Hired', color: '#009B3A', background: '#FFFFFF' },
        { value: jobApplications.filter((application) => application.viewed_by_employer === false).length, label: 'Unviewed', color: '#F27500', background: '#FFF9E8' },
    ]
    const filteredApplications = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        return query
            ? jobApplications.filter((application) => {
                const candidateName = application?.candidate?.name || ''
                const candidateEmail = application?.candidate?.email || ''
                return `${candidateName} ${candidateEmail}`.toLowerCase().includes(query)
            })
            : jobApplications
    }, [jobApplications, searchQuery])
    const handleAddNotes = (application: any) => {
        const existingNotes = typeof application?.notes === 'string'
            ? application.notes
            : application?.notes?.notes || ''
        setSelectedApplication(application)
        setNotesContent(existingNotes)
        setNotesModalVisible(true)
    }

    const handleSaveNotes = async () => {
        const candidateId = selectedApplication?.id
        const notes = notesContent.trim()
        if (!candidateId || !notes) {
            return
        }

        setIsSavingNotes(true)
        try {
            const userLoggedInData = await AsyncStore.getData(AsyncStore.Keys.USER_DATA)
            if (!userLoggedInData) {
                throw new Error('User session is unavailable')
            }
            const userId = JSON.parse(userLoggedInData)?.id
            if (!userId) {
                throw new Error('User ID is unavailable')
            }
            await dispatch(addNotesToCandidateProfile({
                userId: String(userId),
                candidateId: String(candidateId),
                notes,
            })).unwrap()
            await handleJobApplications()
            setNotesModalVisible(false)
        } catch (error) {
            console.error('Failed to add notes to candidate profile', error)
        } finally {
            setIsSavingNotes(false)
        }
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MoveLeft />
                    <Text style={styles.backText}>Back to Jobs</Text>
                </Pressable>

                <View style={styles.heading}>
                    <Text style={styles.title}>{jobTitle}</Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>{jobApplications.length} Applications</Text>
                        <Text style={styles.metaDivider}>·</Text>
                        <MapPin size={13} color="#111827" />
                        <Text style={styles.metaText}>{job?.location || 'bangalore'}</Text>
                        <Text style={styles.metaDivider}>·</Text>
                        <BriefcaseBusiness size={13} color="#111827" />
                        <Text style={styles.metaText}>{job?.employment_type || 'Full Time'}</Text>
                    </View>
                </View>

                <View style={styles.statsGrid}>
                    {statCards.map((stat) => (
                        <View key={stat.label} style={[styles.statCard, { backgroundColor: stat.background, width: width < 360 ? '47%' : '47%' }]}>
                            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.searchContainer}>
                    <Search size={16} color="#657080" />
                    <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search by candidate name, email, or location" placeholderTextColor="#6B7280" style={styles.searchInput} />
                    {searchQuery.length > 0 && <Pressable onPress={() => setSearchQuery('')}><X size={16} color="#657080" /></Pressable>}
                </View>

                {filteredApplications.length === 0 ? (
                    <View style={styles.emptyApplicationsCard}>
                        <Search size={48} color="#8994A4" strokeWidth={1.8} />
                        <Text style={styles.emptyApplicationsTitle}>No applications found</Text>
                        <Text style={styles.emptyApplicationsText}>Try adjusting your search or filters</Text>
                        {/* <Pressable style={styles.clearFiltersButton} onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
                        </Pressable> */}
                    </View>
                ) : filteredApplications.map((application) => (
                    <View key={application?.id} style={[styles.applicationCard, openStatusId === application.id && styles.applicationCardMenuOpen]}>
                        <View style={styles.avatar}><Text style={styles.avatarText}>{application?.candidate?.name?.[0] || 'T'}</Text></View>
                        <View style={styles.applicationBody}>
                            {openStatusId === application.id && (
                                <Pressable
                                    style={styles.cardDropdownDismissOverlay}
                                    onPress={() => setOpenStatusId(null)}
                                />
                            )}
                            <View style={styles.applicationTopRow}>
                                <View style={styles.nameBlock}>
                                    <Text style={styles.applicationName}>{application?.candidate?.name}</Text>
                                    {application?.viewed_by_employer === false && <Text style={styles.newBadge}>New</Text>}
                                </View>


                            </View>

                            <ApplicationStatusBadge status={application.status} />
                            <Text style={styles.email}>{application?.candidate?.email}</Text>
                            {!!application?.notes && (
                                <View style={styles.savedNotesCard}>
                                    <View style={styles.savedNotesHeading}>
                                        <StickyNote size={13} color="#A16207" />
                                        <Text style={styles.savedNotesLabel}>Your Notes:</Text>
                                    </View>
                                    <Text style={styles.savedNotesText}>
                                        {typeof application.notes === 'string' ? application.notes : application.notes?.notes}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.statusMenuContainer}>
                                <Pressable
                                    style={styles.statusButton}
                                    onPress={() => setOpenStatusId(openStatusId === application.id ? null : application.id)}
                                >
                                    <Text style={styles.statusButtonText}>
                                        <Text style={styles.statusMenuTitle}>Change Status</Text>
                                    </Text>
                                    <ChevronDown size={14} color="#111827" />
                                </Pressable>
                                {openStatusId === application.id && (
                                    <View style={styles.statusMenu}>

                                        {statusOptions.map((option) => (
                                            <Pressable
                                                key={option.value}
                                                style={styles.statusOption}
                                                onPress={() => handleUpdateStatus(application.id, option.value)}
                                            >
                                                {option.icon}
                                                <Text style={styles.statusOptionText}>{option.label}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
                            </View>
                            <View style={styles.applicationBottomRow}>
                                <Text style={styles.appliedText}>Applied{`\n`}{getApplicationAge(application.applied_at)}</Text>
                                <View style={styles.actionRow}>
                                    <Pressable style={styles.outlineAction} onPress={() => navigation.navigate('CandidateProfile', { candidateId: application?.user_id, email: application?.candidate?.email })}><UserRound size={14} color="#111827" /><Text style={styles.actionText}>View Profile</Text></Pressable>
                                    {
                                        application?.resume_url && (
                                            <Pressable style={styles.outlineAction} onPress={() => Linking.openURL(application?.resume_url)}>
                                                <Download size={15} color="#374151" />
                                                <Text style={styles.actionText}>Resume</Text>
                                            </Pressable>
                                        )
                                    }
                                    <Pressable style={styles.outlineAction} onPress={() => handleAddNotes(application)}>
                                        <StickyNote size={14} color="#111827" />
                                        <Text style={styles.actionText}>{application?.notes ? 'Edit Notes' : 'Add Notes'}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
                {openStatusId !== null && (
                    <Pressable
                        style={styles.dropdownDismissOverlay}
                        onPress={() => setOpenStatusId(null)}
                    />
                )}
            </ScrollView>
            <Modal
                visible={notesModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => !isSavingNotes && setNotesModalVisible(false)}
            >
                <View style={styles.notesModalOverlay}>
                    <View style={styles.notesModal}>
                        <View style={styles.notesModalHeading}>
                            <StickyNote size={16} color="#A16207" />
                            <Text style={styles.notesModalTitle}>
                                {selectedApplication?.notes ? 'Edit Notes' : 'Add Notes'}
                            </Text>
                        </View>
                        <TextInput
                            value={notesContent}
                            onChangeText={setNotesContent}
                            style={styles.notesInput}
                            placeholder="Enter your notes"
                            placeholderTextColor="#8A6D1D"
                            multiline
                            textAlignVertical="top"
                            editable={!isSavingNotes}
                        />
                        <View style={styles.notesModalActions}>
                            <Pressable
                                style={styles.notesCancelButton}
                                onPress={() => setNotesModalVisible(false)}
                                disabled={isSavingNotes}
                            >
                                <Text style={styles.notesCancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.notesSaveButton, isSavingNotes && styles.notesSaveButtonDisabled]}
                                onPress={handleSaveNotes}
                                disabled={isSavingNotes || !notesContent.trim()}
                            >
                                {isSavingNotes ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.notesSaveText}>Save Notes</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default ViewApplications

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F9FC' },
    content: { paddingHorizontal: 10, paddingTop: 12, paddingBottom: 28 },
    backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
    backArrow: { color: '#111827', fontSize: 17, marginRight: 10 },
    backText: { color: '#111827', fontSize: 14, fontFamily: 'Geist-VariableFont_wght' },
    heading: { marginBottom: 14, padding: 10 },
    title: { color: '#111827', fontSize: 25, fontWeight: '700', fontFamily: 'Geist-VariableFont_wght', marginBottom: 6, textTransform: 'capitalize' },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' },
    metaText: { color: '#111827', fontSize: 14, fontFamily: 'Geist-VariableFont_wght', textTransform: 'capitalize' },
    metaDivider: { color: '#657080', fontSize: 14 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, marginBottom: 16, paddingHorizontal: 10 },
    statCard: { minHeight: 90, borderRadius: 10, borderWidth: 1, borderColor: '#D9DDE4', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
    statValue: { fontSize: 20, fontWeight: '700', fontFamily: 'Geist-VariableFont_wght', marginBottom: 5 },
    statLabel: { color: '#111827', fontSize: 14, fontFamily: 'Geist-VariableFont_wght' },
    searchContainer: { height: 45, borderWidth: 1, borderColor: '#D9DDE4', borderRadius: 6, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, marginBottom: 12 },
    searchInput: { flex: 1, color: '#111827', fontSize: 14, fontFamily: 'Geist-VariableFont_wght', paddingVertical: 0, marginLeft: 7 },
    emptyApplicationsCard: { minHeight: 266, marginTop: 2, paddingHorizontal: 20, paddingVertical: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D9DDE4', borderRadius: 10, shadowColor: '#000000', shadowOpacity: 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
    emptyApplicationsTitle: { marginTop: 16, color: '#111827', fontSize: 16, fontWeight: '600', fontFamily: 'Geist-VariableFont_wght' },
    emptyApplicationsText: { marginTop: 8, color: '#374151', fontSize: 13, fontFamily: 'Geist-VariableFont_wght' },
    clearFiltersButton: { marginTop: 20, paddingHorizontal: 15, paddingVertical: 7, borderWidth: 1, borderColor: '#D9DDE4', borderRadius: 6, backgroundColor: '#FFFFFF' },
    clearFiltersText: { color: '#111827', fontSize: 12, fontFamily: 'Geist-VariableFont_wght' },
    applicationCard: { flex: 1, flexDirection: 'row', backgroundColor: '#F4F8FF', borderWidth: 1, borderColor: '#A9D0FF', borderRadius: 8, padding: 14, marginVertical: 10 },
    applicationCardMenuOpen: { zIndex: 11, elevation: 11 },
    avatar: { width: 39, height: 39, borderRadius: 22, backgroundColor: '#7137F5', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    avatarText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', fontFamily: 'Geist-VariableFont_wght' },
    applicationBody: { flex: 1, position: 'relative' },
    applicationTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    nameBlock: { flex: 1, paddingRight: 5 },
    applicationName: { color: '#111827', fontSize: 14, fontWeight: '700', lineHeight: 20, fontFamily: 'Geist-VariableFont_wght' },
    newBadge: { alignSelf: 'flex-start', color: '#FFFFFF', backgroundColor: '#155EEF', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 6, fontSize: 12, fontWeight: '700', marginTop: 3, overflow: 'hidden', fontFamily: 'Geist-VariableFont_wght', marginVertical: 3 },
    statusMenuContainer: { width: '50%', position: 'relative', zIndex: 20, elevation: 20 },
    cardDropdownDismissOverlay: { position: 'absolute', top: -14, right: -14, bottom: -14, left: -67, zIndex: 10 },
    statusButton: { width: '100%', height: 30, borderWidth: 1, borderColor: '#CBD2DB', borderRadius: 5, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 6 },
    statusButtonText: { color: '#111827', fontSize: 12, fontFamily: 'Geist-VariableFont_wght' },
    statusMenu: { position: 'absolute', top: 34, left: 0, width: '100%', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D9DDE4', borderRadius: 4, shadowColor: '#000000', shadowOpacity: 0.16, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 21, zIndex: 21 },
    dropdownDismissOverlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 10 },
    statusMenuTitle: { color: '#111827', fontSize: 12, fontFamily: 'Geist-VariableFont_wght', paddingHorizontal: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    statusOption: { minHeight: 34, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10 },
    statusOptionText: { color: '#111827', fontSize: 12, fontFamily: 'Geist-VariableFont_wght' },
    statusBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2, marginVertical: 10 },
    statusBadgeText: { fontSize: 10, fontFamily: 'Geist-VariableFont_wght' },
    pendingBadge: { backgroundColor: '#FFFFFF', borderColor: '#CBD2DB' },
    reviewingBadge: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
    shortlistedBadge: { backgroundColor: '#FAF5FF', borderColor: '#D8B4FE' },
    hiredBadge: { backgroundColor: '#ECFDF3', borderColor: '#86EFAC' },
    rejectedBadge: { backgroundColor: '#FFF1F2', borderColor: '#FDA4AF' },
    email: { color: '#111827', fontSize: 14, marginTop: 7, fontFamily: 'Geist-VariableFont_wght' },
    savedNotesCard: { marginTop: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFCE8', borderWidth: 1, borderColor: '#F5D64A', borderRadius: 8, marginBottom: 10 },
    savedNotesHeading: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
    savedNotesLabel: { color: '#111827', fontSize: 11, fontFamily: 'Geist-VariableFont_wght' },
    savedNotesText: { color: '#111827', fontSize: 11, lineHeight: 16, fontFamily: 'Geist-VariableFont_wght', paddingLeft: 18 },
    notesModalOverlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    notesModal: { width: '100%', maxWidth: 420, padding: 16, backgroundColor: '#FFFCE8', borderWidth: 1, borderColor: '#F5D64A', borderRadius: 8 },
    notesModalHeading: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 },
    notesModalTitle: { color: '#111827', fontSize: 15, fontWeight: '600', fontFamily: 'Geist-VariableFont_wght' },
    notesInput: { minHeight: 110, padding: 10, borderWidth: 1, borderColor: '#E8D879', borderRadius: 6, backgroundColor: '#FFFFFF', color: '#111827', fontSize: 13, fontFamily: 'Geist-VariableFont_wght' },
    notesModalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 14 },
    notesCancelButton: { minWidth: 80, height: 38, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#D6C76B', borderRadius: 6, backgroundColor: '#FFFFFF', paddingHorizontal: 12 },
    notesCancelText: { color: '#374151', fontSize: 13, fontFamily: 'Geist-VariableFont_wght' },
    notesSaveButton: { minWidth: 100, height: 38, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: '#111827', paddingHorizontal: 12 },
    notesSaveButtonDisabled: { opacity: 0.65 },
    notesSaveText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', fontFamily: 'Geist-VariableFont_wght' },
    applicationBottomRow: { marginVertical: 15, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', },
    appliedText: { color: '#657080', fontSize: 12, lineHeight: 16, fontFamily: 'Geist-VariableFont_wght', marginBottom: 10 },
    actionRow: { flexDirection: 'column', gap: 5, alignItems: 'flex-start', flexWrap: 'wrap' },
    outlineAction: { flexDirection: 'row', alignItems: 'center', gap: 3, borderWidth: 1, borderColor: '#CBD2DB', borderRadius: 5, backgroundColor: '#FFFFFF', paddingHorizontal: 6, paddingVertical: 5, marginBottom: 10 },
    actionText: { color: '#111827', fontSize: 12, fontFamily: 'Geist-VariableFont_wght' },
})