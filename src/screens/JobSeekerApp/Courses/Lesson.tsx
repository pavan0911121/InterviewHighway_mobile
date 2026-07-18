import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, LayoutAnimation, Platform, UIManager, } from 'react-native'
import { MoveLeft, ChevronRight } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseChapterLessonDetailsById } from '../../../Redux/slices/coursesSlice';


const { width } = Dimensions.get('window');
const Lesson: React.FC<{ route: any }> = ({ route }) => {
  const { enrolledCourseId } = route?.params
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(true);
  const selector = useSelector((state: any) => state.courses);
  const chapterId = selector?.chapterId
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    if (chapterId) {
      dispatch(getCourseChapterLessonDetailsById(chapterId) as any);
    }
  }, [chapterId]);
  const toggleChapter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => { navigation.goBack() }}>
          <MoveLeft size={20} color="#000" />
          <Text style={styles.backText}>Back to Courses</Text>
        </TouchableOpacity>

        <View style={styles.courseCard}>
          <View style={styles.banner}>
            <Image
              source={require('../../../assets/py.webp')}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.courseTitle}>Test Course</Text>
          <Text style={styles.courseSubtitle}>test</Text>

          <View style={styles.statsRow}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Tutor</Text>
              <Text style={styles.metaValue}>tutor test</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>4 hours</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Chapters</Text>
              <Text style={styles.metaValue}>1</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Your Progress</Text>
              <Text style={styles.progressPercent}>0% Complete</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>

        <View style={styles.chapterSection}>
          <View style={styles.chapterHeader}>
            <Text style={styles.chapterTitle}>Course Chapters</Text>
            <Text style={styles.chapterCount}>1 chapters</Text>
          </View>

          <TouchableOpacity style={styles.chapterCard} onPress={toggleChapter} activeOpacity={0.9}>
            <View style={styles.chapterRow}>
              <View style={styles.chapterIndexBox}>
                <Text style={styles.chapterIndex}>1</Text>
              </View>
              <View style={styles.chapterInfo}>
                <Text style={styles.chapterName}>python</Text>
                <Text style={styles.chapterDetail}>1 lesson</Text>
              </View>
              <View style={styles.chapterRight}>
                <Text style={styles.chapterProgress}>0%</Text>
                <ChevronRight
                  size={20}
                  color="#999"
                  style={expanded ? styles.iconOpen : styles.iconClosed}
                />
              </View>
            </View>
            <View style={styles.chapterProgressTrack}>
              <View style={styles.chapterProgressFill} />
            </View>
            {expanded && (
              <View style={styles.lessonSection}>
                <TouchableOpacity style={styles.lessonItem} activeOpacity={0.85} onPress={() => navigation.navigate('LessonDetails' as never)}>
                  <View style={styles.lessonRow}>
                    <View style={styles.lessonIcon}>
                      <Text style={styles.lessonIconText}>▶</Text>
                    </View>
                    <View style={styles.lessonInfoBlock}>
                      <Text style={styles.lessonTitle}>lesson 1</Text>
                      <Text style={styles.lessonSub}>Resources</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Lesson

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  banner: {
    height: 176,
    borderRadius: 16,
    backgroundColor: '#0B3276',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: width * 0.5,
    borderRadius: 12,
    marginVertical: 12,
  },
  bannerLabel: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerLabelText: {
    fontSize: 32,
    color: '#0B3276',
    fontWeight: '700',
    fontFamily: 'Geist-VariableFont_wght',
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Geist-VariableFont_wght',
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontFamily: 'Geist-VariableFont_wght',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  metaBox: {
    flex: 1,
    minWidth: 96,
    backgroundColor: '#F7F8FB',
    borderRadius: 14,
    padding: 14,
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    fontFamily: 'Geist-VariableFont_wght',
  },
  metaValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    fontFamily: 'Geist-VariableFont_wght',
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    fontFamily: 'Geist-VariableFont_wght',
  },
  progressPercent: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E5E7F0',
    overflow: 'hidden',
  },
  progressFill: {
    width: '0%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#165DFC',
  },
  chapterSection: {
    marginBottom: 20,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chapterTitle: {
    fontSize: 18,
    color: '#000',
    fontWeight: '700',
    fontFamily: 'Geist-VariableFont_wght',
  },
  chapterCount: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
  },
  chapterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  chapterIndexBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterIndex: {
    fontSize: 14,
    color: '#165DFC',
    fontWeight: '700',
    fontFamily: 'Geist-VariableFont_wght',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterName: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Geist-VariableFont_wght',
  },
  chapterDetail: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
  },
  chapterRight: {
    alignItems: 'flex-end',
  },
  chapterProgress: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
    fontFamily: 'Geist-VariableFont_wght',
  },
  chapterProgressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E5E7F0',
    marginTop: 14,
    overflow: 'hidden',
  },
  chapterProgressFill: {
    width: '0%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#165DFC',
  },
  iconOpen: {
    transform: [{ rotate: '90deg' }],
  },
  iconClosed: {
    transform: [{ rotate: '0deg' }],
  },
  lessonSection: {
    marginTop: 16,
  },
  lessonItem: {
    backgroundColor: '#F7F8FB',
    borderRadius: 16,
    padding: 14,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lessonIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E8F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIconText: {
    fontSize: 14,
    color: '#165DFC',
    fontWeight: '700',
    fontFamily: 'Geist-VariableFont_wght',
  },
  lessonInfoBlock: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  lessonSub: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
  },
})