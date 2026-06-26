import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CircleX, Info, RefreshCcw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FONT_FAMILY = 'Geist-VariableFont_wght';

interface PaymentStatusProps {
  goBack: () => void;
}

const PaymentSuccess = ({ goBack }: PaymentStatusProps) => (

  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.iconCircle}>
      <Text style={styles.successIcon}>✔️</Text>
    </View>
    <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
    <Text style={styles.successSubtitle}>Welcome to your learning journey! You now have full access to the course content.</Text>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>Payment Confirmed</Text>
      <View style={styles.cardRow}>
        <View style={styles.cardCol}>
          <Text style={styles.cardLabel}>Amount Paid</Text>
          <Text style={styles.cardValue}>₹10</Text>
        </View>
        <View style={styles.cardCol}>
          <Text style={styles.cardLabel}>Transaction Date</Text>
          <Text style={styles.cardValue}>31 May 2026 at 06:58 pm</Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <View style={styles.cardCol}>
          <Text style={styles.cardLabel}>Payment ID:</Text>
          <Text style={styles.cardValue}>pay_SvzHJPOfci3Zz</Text>
        </View>
        <View style={styles.cardCol}>
          <Text style={styles.cardLabel}>Order ID:</Text>
          <Text style={styles.cardValue}>order_1780234109521</Text>
        </View>
      </View>
    </View>

    <View style={styles.courseCard}>
      <Text style={styles.courseAccess}>Course Access Granted</Text>
      <View style={styles.courseRow}>
        <Image source={{ uri: 'https://img.icons8.com/color/96/python.png' }} style={styles.courseImage} />
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>Test Course</Text>
          <View style={styles.courseTags}>
            <Text style={styles.courseTag}>Certificate Eligible</Text>
            <Text style={styles.courseTag}>Lifetime Access</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>Start Learning Now →</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity style={styles.secondaryBtn}><Text style={styles.secondaryBtnText}>Download Receipt</Text></TouchableOpacity>
    <TouchableOpacity style={styles.secondaryBtn}><Text style={styles.secondaryBtnText}>View Dashboard</Text></TouchableOpacity>
    <TouchableOpacity style={styles.secondaryBtn}><Text style={styles.secondaryBtnText}>Share Success</Text></TouchableOpacity>

    <View style={styles.whatsNextCard}>
      <Text style={styles.whatsNextTitle}>What's Next?</Text>
      <Text style={styles.whatsNextSubtitle}>Make the most of your course enrollment</Text>
      <View style={styles.whatsNextStep}><Text style={styles.whatsNextStepNum}>1</Text><Text style={styles.whatsNextStepText}>Start with the first lesson</Text></View>
      <Text style={styles.whatsNextStepDesc}>Begin your learning journey with the course introduction</Text>
      <View style={styles.whatsNextStep}><Text style={styles.whatsNextStepNum}>2</Text><Text style={styles.whatsNextStepText}>Join the community</Text></View>
      <Text style={styles.whatsNextStepDesc}>Connect with other learners and ask questions</Text>
      <View style={styles.whatsNextStep}><Text style={styles.whatsNextStepNum}>3</Text><Text style={styles.whatsNextStepText}>Track your progress</Text></View>
      <Text style={styles.whatsNextStepDesc}>Monitor your learning progress and earn certificates</Text>
      <TouchableOpacity style={styles.secondaryBtn}><Text style={styles.secondaryBtnText}>Get Support</Text></TouchableOpacity>
    </View>

    <Text style={styles.footerNote}>Your payment information is secure and encrypted</Text>
    <Text style={styles.footerNote}>A confirmation email has been sent to your registered email</Text>
    <Text style={styles.footerNote}>30-day money-back guarantee applies</Text>
  </ScrollView>
);

const PaymentFailed = ({ goBack }: PaymentStatusProps) => (
  <SafeAreaView style={styles.safeAreaContainer}>

    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconCircleFailed}>
        <CircleX size={30} color="#FF6B6B" />

      </View>
      <Text style={styles.failedTitle}>Payment Failed</Text>
      <Text style={styles.failedSubtitle}>We couldn't process your payment for "Test Course" (₹10). Don't worry, we'll help you resolve this.</Text>

      <View style={styles.cardFailed}>
        <View>
          <CircleX size={20} color="#FF6B6B" />
        </View>
        <View>
          <Text style={styles.cardFailedTitle}>Payment Failed</Text>
          <Text style={styles.cardFailedReason}>Payment cancelled by user</Text>
        </View>
      </View>

      <View style={styles.tryAgainCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, }}>
          <RefreshCcw size={20} color="#000000" />
          <Text style={styles.tryAgainTitle}>Try Again</Text>
        </View>
        <Text style={styles.tryAgainDesc}>Retry your payment for "Test Course" (₹10)</Text>
        {/* <Text style={styles.tryAgainAttempt}>Attempt 1 of 3</Text> */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Info size={20} color="#0081FF" />
          <Text style={styles.tryAgainBefore}>Before retrying:</Text>
        </View>
        <Text style={styles.tryAgainList}>• Check your internet connection{"\n"}• Verify your payment method details{""}• Ensure sufficient balance in your account{""}• Try a different payment method if available</Text>
        <View style={styles.tryAgainBtnRow}>
          <TouchableOpacity style={styles.primaryBtn}><Text style={styles.primaryBtnText}>Retry Payment</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => goBack()}><Text style={styles.secondaryBtnText}>Go Back</Text></TouchableOpacity>
        </View>
      </View>

      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>Need Help?</Text>
        <Text style={styles.helpDesc}>Our support team is here to help resolve payment issues</Text>
        <View style={styles.helpBtnRow}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => Linking.openURL('mailto:support@example.com')}><Text style={styles.secondaryBtnText}>Email Support</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => Linking.openURL('tel:1800123456')}><Text style={styles.secondaryBtnText}>Call Support</Text></TouchableOpacity>
        </View>
        <Text style={styles.helpContact}>Phone Support: Available 9 AM - 9 PM IST</Text>
        <Text style={styles.helpContact}>Email Support: Response within 24 hours</Text>
        <Text style={styles.helpContact}>Live Chat: Available during business hours</Text>
      </View>

      <TouchableOpacity style={styles.secondaryBtn}><Text style={styles.secondaryBtnText}>Browse Other Courses</Text></TouchableOpacity>
      <TouchableOpacity style={styles.secondaryBtn}><Text style={styles.secondaryBtnText}>Go to Dashboard</Text></TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Don't worry, you're not charged</Text>
        <Text style={styles.infoDesc}>Since the payment failed, no money has been deducted from your account. You can safely retry the payment or try a different payment method.</Text>
      </View>

      <Text style={styles.footerNote}>Your payment information remains secure</Text>
      <Text style={styles.footerNote}>100% Safe & SSL Encrypted</Text>
      <Text style={styles.footerNote}>24/7 Support Available</Text>
    </ScrollView>
  </SafeAreaView>
);

const PaymentStatusScreen = () => {
  const route = useRoute();
  const { success } = route.params as { success?: boolean };
  const navigation = (useNavigation() as any);
  const goBack = () => {
    navigation.goBack();
  }
  return success ? <PaymentSuccess goBack={goBack as () => void} /> : <PaymentFailed goBack={goBack as () => void} />;
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    fontFamily: FONT_FAMILY,
  },
  iconCircle: {
    backgroundColor: '#E6FBF0',
    borderRadius: 48,
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  iconCircleFailed: {
    backgroundColor: '#FFE6E6',
    borderRadius: 48,
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  successIcon: {
    fontSize: 36,
    color: '#1DBF73',
    fontFamily: FONT_FAMILY,
  },
  failedIcon: {
    fontSize: 36,
    color: '#FF4D4F',
    fontFamily: FONT_FAMILY,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginTop: 8,
    fontFamily: FONT_FAMILY,
  },
  failedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF4D4F',
    marginTop: 8,
    fontFamily: FONT_FAMILY,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: FONT_FAMILY,
  },
  failedSubtitle: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: FONT_FAMILY,
  },
  card: {
    borderWidth: 1,
    borderColor: '#B7EFC5',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#F8FFFB',
  },
  cardTitle: {
    color: '#1DBF73',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: FONT_FAMILY,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardCol: {
    flex: 1,
  },
  cardLabel: {
    color: '#888',
    fontSize: 13,
    fontFamily: FONT_FAMILY,
  },
  cardValue: {
    color: '#222',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: FONT_FAMILY,
  },
  courseCard: {
    borderWidth: 1,
    borderColor: '#B7D6F8',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#F8FBFF',
  },
  courseAccess: {
    color: '#1976D2',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 8,
    fontFamily: FONT_FAMILY,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
    fontFamily: FONT_FAMILY,
  },
  courseTags: {
    flexDirection: 'row',
    marginTop: 4,
  },
  courseTag: {
    backgroundColor: '#E6F0FA',
    color: '#1976D2',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    marginRight: 8,
    fontFamily: FONT_FAMILY,
  },
  primaryBtn: {
    backgroundColor: '#1DBF73',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    fontFamily: FONT_FAMILY,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  secondaryBtnText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: FONT_FAMILY,
  },
  whatsNextCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  whatsNextTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
    fontFamily: FONT_FAMILY,
  },
  whatsNextSubtitle: {
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
    fontFamily: FONT_FAMILY,
  },
  whatsNextStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  whatsNextStepNum: {
    backgroundColor: '#E6F0FA',
    color: '#1976D2',
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 8,
    fontWeight: '700',
    fontFamily: FONT_FAMILY,
  },
  whatsNextStepText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#222',
    fontFamily: FONT_FAMILY,
  },
  whatsNextStepDesc: {
    color: '#888',
    fontSize: 13,
    marginLeft: 32,
    fontFamily: FONT_FAMILY,
  },
  footerNote: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: FONT_FAMILY,
  },
  // Failed styles
  cardFailed: {
    borderWidth: 1,
    borderColor: '#FFB7B7',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#FFF8F8',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardFailedTitle: {
    color: '#FF4D4F',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
    fontFamily: FONT_FAMILY,
  },
  cardFailedReason: {
    color: '#FF4D4F',
    fontSize: 13,
    fontFamily: FONT_FAMILY,
  },
  tryAgainCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  tryAgainTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
    fontFamily: FONT_FAMILY,
  },
  tryAgainDesc: {
    color: '#444',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: FONT_FAMILY,
  },
  tryAgainAttempt: {
    color: '#1976D2',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 4,
    fontFamily: FONT_FAMILY,
  },
  tryAgainBefore: {
    color: '#888',
    fontSize: 13,
    marginBottom: 2,
    fontFamily: FONT_FAMILY,
  },
  tryAgainList: {
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
    fontFamily: FONT_FAMILY,
  },
  tryAgainBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  helpCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  helpTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
    fontFamily: FONT_FAMILY,
  },
  helpDesc: {
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
    fontFamily: FONT_FAMILY,
  },
  helpBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  helpContact: {
    color: '#888',
    fontSize: 12,
    fontFamily: FONT_FAMILY,
  },
  infoCard: {
    borderWidth: 1,
    borderColor: '#B7D6F8',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#F8FBFF',
  },
  infoTitle: {
    color: '#1976D2',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
    fontFamily: FONT_FAMILY,
  },
  infoDesc: {
    color: '#444',
    fontSize: 13,
    fontFamily: FONT_FAMILY,
  },
});

export default PaymentStatusScreen;
