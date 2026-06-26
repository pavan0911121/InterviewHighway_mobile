import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getLessonDetailsById } from '../../../Redux/slices/coursesSlice';
import { COURSE_ENDPOINTS } from '../../../Networking/EndPoints';
import * as AsyncStore from '../../../AsyncStore';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { MoveLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const resources = [
    {
        id: '1',
        title: 'Privacy Policy IH Feb 26th 2024',
        size: '82 KB',
        icon: '📄',
    },
    {
        id: '2',
        title: 'devplaystheguitar_gr',
        size: '1.6 MB',
        icon: '📄',
    },
    {
        id: '3',
        title: 'Cookie Policy IH Feb 26th 2024',
        size: '10 KB',
        icon: '📄',
    },
]

const LessonDetails = () => {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Resources'>('Overview')
    const [downloadedPdfPaths, setDownloadedPdfPaths] = useState<Record<string, string>>({})
    const [isLoadingPdf, setIsLoadingPdf] = useState(false)
    const [currentDownloadingId, setCurrentDownloadingId] = useState<string | null>(null)
    const selector = useSelector((state: any) => state.courses);
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();
    const lessonId = selector?.lessonId


    useEffect(() => {
        if (lessonId) {
            dispatch(getLessonDetailsById(lessonId) as any);
        }
    }, [lessonId]);

    const handleDownload = async (documentId: string) => {
        if (!lessonId) return

        const downloadUrl = COURSE_ENDPOINTS.DownloadLessonById(lessonId, documentId)
        setIsLoadingPdf(true)
        setCurrentDownloadingId(documentId)

        try {
            const tokenValue = await AsyncStore.getData(AsyncStore?.Keys?.USER_TOKEN)
            const authHeader = tokenValue ? { Authorization: `Bearer ${tokenValue}` } : {}
            const resource = selector?.lessonsData?.resources?.find((item: any) => item.id === documentId)
            const resourceName = resource?.resource_name || `lesson-${documentId}`
            const safeName = resourceName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
            const extension = resourceName.includes('.') ? resourceName.split('.').pop()?.toLowerCase() : 'pdf'
            const fileName = resourceName.includes('.') ? safeName : `${safeName}.${extension}`
            const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`

            const downloadOptions = {
                fromUrl: downloadUrl,
                toFile: filePath,
                headers: authHeader as any,
                background: false,
                discretionary: false,
            }

            const result = await RNFS.downloadFile(downloadOptions).promise
            if (result.statusCode === 200 || result.statusCode === 201) {
                setDownloadedPdfPaths(prev => ({ ...prev, [documentId]: filePath }))
            } else {
                throw new Error(`Document download failed: status ${result.statusCode}`)
            }
        } catch (error) {
            console.error('Document download failed:', error)
        } finally {
            setIsLoadingPdf(false)
            setCurrentDownloadingId(null)
        }
    }

    const handleOpenDocument = async (documentId: string) => {
        const filePath = downloadedPdfPaths[documentId]
        if (!filePath) return

        try {
            const exists = await RNFS.exists(filePath)
            if (!exists) {
                console.error('Open document failed: file does not exist', filePath)
                return
            }
            await FileViewer.open(filePath, { showOpenWithDialog: true })
        } catch (error) {
            console.error('Open document failed:', error)
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MoveLeft size={20} color={'#000'} />
                <Text style={styles.back}> Back to Courses</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                    <Text style={styles.lessonTitle}>lesson 1</Text>
                    <Text style={styles.lessonCount}>0</Text>
                </View>

                <TouchableOpacity style={styles.completeButton} activeOpacity={0.8}>
                    <View style={styles.completeIcon}>
                        <Text style={styles.completeIconText}>✓</Text>
                    </View>
                    <Text style={styles.completeButtonText}>Mark as Complete</Text>
                </TouchableOpacity>

                <View style={styles.lessonCard}>
                    <View style={styles.lessonIconWrapper}>
                        <Text style={styles.lessonIcon}>📘</Text>
                    </View>
                    <Text style={styles.lessonCardTitle}>Text-Based Lesson</Text>
                    <Text style={styles.lessonCardSubtitle}>This lesson contains written content and resources.</Text>
                </View>

                <View style={styles.tabRow}>
                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'Overview' && styles.activeTab]}
                        activeOpacity={0.8}
                        onPress={() => setActiveTab('Overview')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Overview' && styles.activeTabText]}>Overview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'Resources' && styles.activeTab]}
                        activeOpacity={0.8}
                        onPress={() => setActiveTab('Resources')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Resources' && styles.activeTabText]}>Resources</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'Overview' ? (
                    <>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>COURSE</Text>
                            <Text style={styles.infoTitle}>{selector?.lessonsData?.course?.title}</Text>
                            <Text style={styles.infoSubtitle}>by {selector?.lessonsData?.course?.instructor_name}</Text>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>CHAPTER</Text>
                            <Text style={styles.infoTitle}>{selector?.lessonsData?.chapter?.title}</Text>
                            <Text style={styles.infoSubtitle}>Chapter {selector?.lessonsData?.chapter?.chapter_order}</Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.resourcesContainer}>
                        <Text style={styles.resourcesHeading}>Downloadable Resources</Text>
                        {selector?.lessonsData?.resources?.map((item: any) => (
                            <View key={item.id} style={styles.resourceCard}>
                                <View style={styles.resourceLeft}>
                                    <Text style={styles.resourceIcon}>{item.icon}</Text>
                                </View>
                                <View style={styles.resourceInfo}>
                                    <Text style={styles.resourceTitle}>{item.resource_name}</Text>
                                    <Text style={styles.resourceSize}>{item.size}</Text>
                                </View>
                                <View style={styles.resourceActions}>
                                    <TouchableOpacity
                                        style={[styles.downloadButton, currentDownloadingId === item.id && styles.downloadButtonDisabled]}
                                        activeOpacity={0.85}
                                        onPress={() => handleDownload(item.id)}
                                        disabled={currentDownloadingId === item.id}
                                    >
                                        {currentDownloadingId === item.id ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <Text style={styles.downloadText}>{downloadedPdfPaths[item.id] ? 'Redownload' : 'Download'}</Text>
                                        )}
                                    </TouchableOpacity>
                                    {downloadedPdfPaths[item.id] && (
                                        <TouchableOpacity style={styles.openButton} activeOpacity={0.85} onPress={() => handleOpenDocument(item.id)}>
                                            <Text style={styles.openButtonText}>Open</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}
                        {isLoadingPdf && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#000" />
                                <Text style={styles.loadingText}>Loading document...</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default LessonDetails

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,

    },
    back: {
        fontFamily: 'Geist-VariableFont_wght',
        fontSize: 14,
        color: '#000000',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    container: {
        padding: 16,
        backgroundColor: '#F5F7FA',
        paddingBottom: 32,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    lessonTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        fontFamily: 'Geist-VariableFont_wght',
    },
    lessonCount: {
        fontSize: 16,
        color: '#000',
        fontWeight: '700',
        fontFamily: 'Geist-VariableFont_wght',
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    completeIcon: {
        width: 28,
        height: 28,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    completeIconText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        fontFamily: 'Geist-VariableFont_wght',
    },
    completeButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
        fontFamily: 'Geist-VariableFont_wght',
    },
    lessonCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
        marginBottom: 20,
    },
    lessonIconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#E8F0FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    lessonIcon: {
        fontSize: 24,
    },
    lessonCardTitle: {
        fontSize: 18,
        color: '#000',
        fontWeight: '700',
        marginBottom: 8,
        fontFamily: 'Geist-VariableFont_wght',
    },
    lessonCardSubtitle: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        fontFamily: 'Geist-VariableFont_wght',
    },
    tabRow: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F5',
        borderRadius: 16,
        padding: 4,
        marginBottom: 20,
    },
    tabItem: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 14,
    },
    activeTab: {
        backgroundColor: '#fff',
    },
    tabText: {
        fontSize: 14,
        color: '#747280',
        fontFamily: 'Geist-VariableFont_wght',
    },
    activeTabText: {
        color: '#000',
        fontWeight: '700',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 6,
        fontFamily: 'Geist-VariableFont_wght',
    },
    infoTitle: {
        fontSize: 16,
        color: '#000',
        fontWeight: '700',
        marginBottom: 4,
        fontFamily: 'Geist-VariableFont_wght',
    },
    infoSubtitle: {
        fontSize: 13,
        color: '#666',
        fontFamily: 'Geist-VariableFont_wght',
    },
    resourcesContainer: {
        marginBottom: 20,
    },
    resourcesHeading: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 14,
        fontFamily: 'Geist-VariableFont_wght',
    },
    resourceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    resourceLeft: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#E8F0FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    resourceIcon: {
        fontSize: 18,
    },
    resourceInfo: {
        flex: 1,
    },
    resourceActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    resourceTitle: {
        fontSize: 14,
        color: '#000',
        fontWeight: '700',
        marginBottom: 4,
        fontFamily: 'Geist-VariableFont_wght',
    },
    resourceSize: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Geist-VariableFont_wght',
    },
    downloadButton: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: '#000',
        borderRadius: 14,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    downloadButtonDisabled: {
        opacity: 0.7,
    },
    downloadText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '700',
        fontFamily: 'Geist-VariableFont_wght',
    },
    loadingContainer: {
        marginTop: 16,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    loadingText: {
        fontSize: 13,
        color: '#333',
        fontFamily: 'Geist-VariableFont_wght',
    },
    openButton: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: '#F1F1F5',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    openButtonText: {
        fontSize: 13,
        color: '#000',
        fontWeight: '700',
        fontFamily: 'Geist-VariableFont_wght',
    },
})