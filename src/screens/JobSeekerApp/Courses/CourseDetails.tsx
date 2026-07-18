import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createOrder, getCourseChaptersById, getEnrollmentCourses, verifyOrder } from '../../../Redux/slices/coursesSlice';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import { BookOpen, Clock4, CreditCard, Lock, MoveLeft, Play, Shield, TrendingUp, User } from 'lucide-react-native';
import * as AsyncStore from "../../../AsyncStore";

const { width } = Dimensions.get('window');

const CourseDetails: React.FC<{ route: any }> = ({ route }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { courseData } = route?.params
  const selector = useSelector((state: any) => state.courses);
  const courseDetails = courseData
  useEffect(() => {
    handleEnrollmentCourses()
    if(courseDetails?.id){
      dispatch(getCourseChaptersById(courseDetails?.id) as any);
    }
  }, [])
  const handleEnrollmentCourses = async () => {
    const userLoggedID = await AsyncStore.getData(AsyncStore?.Keys?.USER_ID);
    if (userLoggedID) {
      const parsedUserData = JSON.parse(userLoggedID);
      const response = await dispatch(getEnrollmentCourses(parsedUserData) as any);
    }
  }
  const handlePayment = () => {
    const body = {
      courseId: courseDetails?.id,
      amount: 10,
      currency: "INR"
    }
    dispatch(createOrder(body) as any);
    var options = {
      description: 'Test Order from mobile app',
      image: '../../../assets/logo.png',
      currency: 'INR',
      key: 'rzp_live_STwYEZ6DIV5kWw', // Your api key
      amount: '10',
      name: 'InterviewHighway',
      order_id: selector?.orderData?.order?.id,
      prefill: {
        email: '',
        contact: '',
        name: ''
      },
      theme: { color: '#53a20e' }
    }
    RazorpayCheckout.open(options).then((data: any) => {
      // handle success
      const body = {
        razorpay_order_id: selector?.orderData?.order?.id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      }
      dispatch(verifyOrder(body) as any);
      (navigation.navigate as any)('PaymentStatusScreen', { status: "Success" });
    }).catch((error: any) => {
      // handle failure
      (navigation.navigate as any)('PaymentStatusScreen', { status: "Failed" });
      console.log(error, "error");
      Alert.alert(`Payment has been cancelled`);
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {selector?.isLoading ?
        <View style={{ flex: 1, justifyContent: 'flex-start', }}>
          <ActivityIndicator size="large" color="#0000ff" animating={selector?.isLoading} />
        </View> :
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MoveLeft size={20} color={'#000'} />
            <Text style={styles.back}> Back to Courses</Text>
          </TouchableOpacity>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>business</Text>
          </View>

          <Text style={styles.title}>{courseDetails?.title}</Text>

          {/* Instructor */}
          <View style={styles.instructorRow}>
            <View style={styles.avatar}>
              <User color={'#fff'} />
            </View>
            <Text style={styles.instructorText}>Instructor: {courseDetails?.instructor_name}</Text>
          </View>

          {/* Course Image */}
          <Image
            source={require('../../../assets/py.webp')} // replace with your image
            style={styles.image}
            resizeMode="cover"
          />

          {/* Course Details Tags */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Course Details</Text>

            <View style={styles.tagRow}>
              <View style={styles.tagBlue}>
                <Text style={styles.tagTextBlue}>business</Text>
              </View>

              <View style={styles.tagGreen}>
                <Text style={styles.tagTextGreen}>beginner level</Text>
              </View>
            </View>
          </View>

          {/* About */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About this course</Text>
            <Text style={styles.desc}>{courseDetails?.description}</Text>
          </View>

          {/* Modules */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>There are {courseDetails?.total_chapters} modules in this course</Text>

            <View style={styles.moduleBox}>
              <Text style={styles.moduleTitle}>Module 1: python</Text>
              <Text style={styles.moduleSub}>python1</Text>
              <Text style={styles.moduleMeta}>{courseDetails?.total_chapters} lessons · <Lock size={13} color={'#999'} /> Enrollment required</Text>
            </View>
          </View>

          {/* Instructor Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Instructor</Text>

            <View style={styles.instructorRow}>
              <View style={styles.avatar}>
                <User color={'#fff'} />
              </View>
              <Text style={styles.instructorText}>{courseDetails?.instructor_name}</Text>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.card}>
            <Text style={styles.price}>INR{courseDetails?.price}</Text>
            <Text style={styles.subText}>One-time payment</Text>
            {selector?.enrolledCourse?.length > 0 ? (
              <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={() => navigation.navigate('Lesson', {enrolledCourseId: selector?.enrolledCourse[0]?.course?.id})}>
                <Play size={16} color={'#FFF'} />
                <Text style={styles.buttonText}>Continue Learning</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <View style={styles.securityRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Shield size={16} color={'#777'} />
                    <Text style={styles.security}>Secure Payment · ₹10</Text>
                  </View>

                  <Text style={styles.security}>SSL Protected</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handlePayment}>
                  <CreditCard size={16} color={'#FFF'} />
                  <Text style={styles.buttonText}>Enroll Now · ₹{courseDetails?.price}</Text>
                </TouchableOpacity>

                <View style={styles.footerRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Shield size={16} color={'#777'} />
                    <Text style={styles.footerText}>256-bit SSL</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <CreditCard size={16} color={'#777'} />
                  </View>
                  <Text style={styles.footerText}>Razorpay Secure</Text>
                  <Text style={styles.footerText}>Money Back Guarantee</Text>
                </View>
              </View>
            )}


          </View>

          {/* Details */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Details to know</Text>

            <View style={styles.detailRow}>
              <View>
                <Clock4 size={16} color={'#777'} />
              </View>
              <View>
                <Text style={styles.detailLabel}> Duration</Text>
                <Text style={styles.detailValue}>4 hours</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View>
                <TrendingUp size={16} color={'#777'} />
              </View>
              <View>

                <Text style={styles.detailLabel}>Level</Text>
                <Text style={styles.detailValue}>Beginner</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View>
                <BookOpen size={16} color={'#777'} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Course Type</Text>
                <Text style={styles.detailValue}>InterviewHighway Course</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      }

    </SafeAreaView>
  );
};

export default CourseDetails;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
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

  badge: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  badgeText: {
    fontFamily: 'Geist-VariableFont_wght',
    fontSize: 12,
    color: '#2563EB',
  },

  title: {
    fontFamily: 'Geist-VariableFont_wght',
    fontSize: 26,
    fontWeight: '700',
    marginVertical: 10,
  },

  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#005FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  avatarText: {
    color: '#fff',
  },

  instructorText: {
    fontFamily: 'Geist-VariableFont_wght',
    fontSize: 20,
  },

  image: {
    width: '100%',
    height: width * 0.5,
    borderRadius: 12,
    marginVertical: 12,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
  },

  cardTitle: {
    fontFamily: 'Geist-VariableFont_wght',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },

  tagRow: {
    flexDirection: 'row',
    gap: 10,
  },

  tagBlue: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  tagGreen: {
    backgroundColor: '#E6F7EC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  tagTextBlue: {
    color: '#2563EB',
    fontFamily: 'Geist-VariableFont_wght',
  },

  tagTextGreen: {
    color: '#16A34A',
    fontFamily: 'Geist-VariableFont_wght',
  },

  desc: {
    fontFamily: 'Geist-VariableFont_wght',
    color: '#555',
  },

  moduleBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },

  moduleTitle: {
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
  },

  moduleSub: {
    color: '#777',
    marginVertical: 4,
  },

  moduleMeta: {
    fontSize: 12,
    color: '#999',
  },

  price: {
    fontSize: 24,
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '700',
  },

  subText: {
    color: '#666',
    marginBottom: 10,
  },

  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  security: {
    fontSize: 12,
    color: '#444',
  },

  button: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },

  buttonText: {
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
    fontSize: 16,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  footerText: {
    fontSize: 11,
    color: '#777',
    alignItems: 'center',
  },

  detailRow: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  detailLabel: {
    fontFamily: 'Geist-VariableFont_wght',
    fontSize: 13,
    color: '#555',
  },

  detailValue: {
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
    color: '#777',
  },
});