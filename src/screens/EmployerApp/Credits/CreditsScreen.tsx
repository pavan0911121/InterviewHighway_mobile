import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'

const CreditsScreen = () => {
  const navigation = useNavigation()
  const [credits] = useState({
    available: 0,
    used: 0,
    purchased: 0,
    remaining: 0,
  })
  const [selectedPlan, setSelectedPlan] = useState('free')
  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => (navigation.getParent() as DrawerNavigationProp<any>)?.openDrawer()}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTitleRow}>
            <MaterialCommunityIcons name="briefcase" size={32} color="#165DFC" />
            <View>
              <Text style={styles.headerTitle}>Credit</Text>
              <Text style={styles.headerTitleSecond}>Management</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>Purchase credits to post jobs and manage your hiring pipeline</Text>
        </View>

        {/* Launch Offer Card */}
        <View style={styles.offerCard}>
          {/* Header with icon and badge */}
          <View style={styles.offerHeader}>
            <View style={styles.giftIconContainer}>
              <MaterialCommunityIcons name="gift" size={28} color="#fff" />
            </View>
            <View style={styles.offerBadge}>
              <MaterialCommunityIcons name="spark" size={14} color="#fff" />
              <Text style={styles.offerBadgeText}>LAUNCH OFFER</Text>
            </View>
          </View>

          {/* Offer Title */}
          <View style={styles.offerTitleContainer}>
            <MaterialCommunityIcons name="spark" size={20} color="#FFA500" />
            <View style={styles.offerTitleText}>
              <Text style={styles.offerTitle}>FREE Premium Access</Text>
              <Text style={styles.offerTitleSecond}>Until March 31, 2027!</Text>
            </View>
          </View>

          {/* Benefits List */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitRow}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#00C853" />
              <Text style={styles.benefitText}>All plans completely FREE until March 31, 2027</Text>
            </View>
            <View style={styles.benefitRow}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#00C853" />
              <Text style={styles.benefitText}>Unlimited job postings during the free period</Text>
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <View style={styles.infoBoxHeader}>
              <MaterialCommunityIcons name="information-outline" size={20} color="#165DFC" />
              <Text style={styles.infoBoxTitle}>Starting April 1, 2027:</Text>
            </View>

            {/* Credit Plans */}
            <View style={styles.creditPlansContainer}>
              <View style={styles.creditPlanRow}>
                <View style={styles.creditBullet} />
                <Text style={styles.creditPlanText}>
                  <Text style={styles.creditPlanBold}>Standard: 3 credits (₹999)</Text>
                  <Text style={styles.creditPlanBasic}> • </Text>
                  <Text style={styles.creditPlanBold}>Pro: 8 credits (₹1,999)</Text>
                </Text>
              </View>

              <View style={styles.creditPlanRow}>
                <View style={styles.creditBullet} />
                <Text style={styles.creditPlanText}>
                  Credits expire 90 days after purchase • Job renewals every 30 days
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Your Credits Card */}
        <View style={styles.yourCreditsCard}>
          <View style={styles.yourCreditsHeader}>
            <MaterialCommunityIcons name="package-variant" size={24} color="#165DFC" />
            <Text style={styles.yourCreditsTitle}>Your Credits</Text>
          </View>

          {/* Credits Available */}
          <View style={styles.creditStatCard}>
            <Text style={[styles.creditStatNumber, { color: '#165DFC' }]}>
              {credits.available}
            </Text>
            <Text style={styles.creditStatLabel}>Credits Available</Text>
          </View>

          {/* Credits Stats Grid */}
          <View style={styles.creditsStatsGrid}>
            {/* Used */}
            <View style={styles.creditStatItem}>
              <View style={styles.creditStatIconContainer}>
                <MaterialCommunityIcons name="trending-up" size={24} color="#FF9500" />
              </View>
              <Text style={styles.creditStatItemLabel}>Used</Text>
              <Text style={styles.creditStatItemValue}>{credits.used}</Text>
            </View>

            {/* Purchased */}
            <View style={styles.creditStatItem}>
              <View style={styles.creditStatIconContainer}>
                <MaterialCommunityIcons name="package" size={24} color="#00C853" />
              </View>
              <Text style={styles.creditStatItemLabel}>Purchased</Text>
              <Text style={styles.creditStatItemValue}>{credits.purchased}</Text>
            </View>

            {/* Remaining */}
            <View style={styles.creditStatItem}>
              <View style={styles.creditStatIconContainer}>
                <MaterialCommunityIcons name="currency-usd" size={24} color="#165DFC" />
              </View>
              <Text style={styles.creditStatItemLabel}>Remaining</Text>
              <Text style={styles.creditStatItemValue}>{credits.remaining}%</Text>
            </View>
          </View>
        </View>

        {/* Choose Your Plan Section */}
        <View style={styles.planSectionContainer}>
          <Text style={styles.planSectionTitle}>Choose Your Plan</Text>
          <Text style={styles.planSectionSubtitle}>
            Claim your credits now – All plans free during our launch period
          </Text>

          {/* Free Plan Card */}
          <View style={styles.planCard}>
            {/* Auto-Assigned Badge */}
            <View style={styles.planBadgeContainer}>
              <View style={styles.autoAssignedBadge}>
                <MaterialCommunityIcons name="star" size={14} color="#fff" />
                <Text style={styles.autoAssignedBadgeText}>Auto-Assigned</Text>
              </View>
            </View>

            {/* Plan Title */}
            <Text style={styles.planTitle}>Free Plan</Text>

            {/* Included Badge */}
            <View style={styles.includedBadgeContainer}>
              <MaterialCommunityIcons name="gift" size={16} color="#fff" />
              <Text style={styles.includedBadgeText}>Included</Text>
            </View>

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.priceSymbol}>₹</Text>
              <Text style={styles.priceAmount}>0</Text>
            </View>
            <Text style={styles.priceSubtitle}>Auto-assigned on signup</Text>

            {/* Credit Box */}
            <View style={styles.creditBoxContainer}>
              <Text style={styles.creditBoxNumber}>1</Text>
              <Text style={styles.creditBoxLabel}>Credit Included</Text>
            </View>

            {/* Benefits List */}
            <View style={styles.benefitsListContainer}>
              <View style={styles.benefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#333" />
                <Text style={styles.benefitListText}>Post 1 job listing</Text>
              </View>
              <View style={styles.benefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#333" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.benefitListText}>
                    <Text style={styles.benefitBold}>30-day visibility</Text>
                    <Text style={styles.benefitNormal}> per posting</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.benefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#333" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.benefitListText}>
                    Access to <Text style={styles.benefitBold}>qualified candidates</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.benefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#333" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.benefitListText}>
                    <Text style={styles.benefitBold}>Application tracking</Text>
                    <Text style={styles.benefitNormal}> dashboard</Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Included in Account */}
            <View style={styles.includedAccountBox}>
              <MaterialCommunityIcons name="check" size={18} color="#666" />
              <Text style={styles.includedAccountText}>Already included in your account</Text>
            </View>

            {/* Perfect For */}
            <View style={styles.perfectForBox}>
              <MaterialCommunityIcons name="star" size={18} color="#FFA500" />
              <Text style={styles.perfectForText}>Perfect for trying out the platform</Text>
            </View>
          </View>

          {/* Standard Plan Card */}
          <View style={styles.standardPlanCard}>
            {/* Most Popular Badge */}
            <View style={styles.mostPopularBadgeContainer}>
              <View style={styles.mostPopularBadge}>
                <MaterialCommunityIcons name="fire" size={14} color="#fff" />
                <Text style={styles.mostPopularBadgeText}>Most Popular</Text>
              </View>
            </View>

            {/* Plan Title */}
            <Text style={styles.standardPlanTitle}>Standard Plan</Text>

            {/* Free Badge */}
            <View style={styles.standardFreeBadgeContainer}>
              <MaterialCommunityIcons name="gift" size={16} color="#fff" />
              <Text style={styles.standardFreeBadgeText}>FREE until March 31, 2027</Text>
            </View>

            {/* Price */}
            <View style={styles.standardPriceContainer}>
              <Text style={styles.strikethroughPrice}>₹999</Text>
            </View>
            <View style={styles.standardMainPriceContainer}>
              <Text style={styles.standardPriceSymbol}>₹</Text>
              <Text style={styles.standardPriceAmount}>0</Text>
            </View>
            <Text style={styles.standardPriceSubtitle}>No payment required • Launch Offer</Text>

            {/* Regular Price Info */}
            <View style={styles.regularPriceBox}>
              <Text style={styles.regularPriceText}>Regular price ₹999 from April 1, 2027</Text>
            </View>

            {/* Credit Box */}
            <View style={styles.standardCreditBoxContainer}>
              <Text style={styles.standardCreditBoxNumber}>3</Text>
              <Text style={styles.standardCreditBoxLabel}>Credits Included</Text>
              <Text style={styles.standardCreditBoxSubtitle}>(Worth ₹999 after launch)</Text>
            </View>

            {/* Benefits List */}
            <View style={styles.standardBenefitsListContainer}>
              <View style={styles.standardBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#00C853" />
                <Text style={styles.standardBenefitListText}>Post 3 job listings</Text>
              </View>
              <View style={styles.standardBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#00C853" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.standardBenefitListText}>
                    <Text style={styles.benefitBold}>30-day visibility</Text>
                    <Text style={styles.benefitNormal}> per posting</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.standardBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#00C853" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.standardBenefitListText}>
                    Access to <Text style={styles.benefitBold}>qualified candidates</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.standardBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#00C853" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.standardBenefitListText}>
                    <Text style={styles.benefitBold}>Application tracking</Text>
                    <Text style={styles.benefitNormal}> dashboard</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.standardBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#00C853" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.standardBenefitListText}>
                    <Text style={styles.benefitBold}>Candidate analytics</Text>
                    <Text style={styles.benefitNormal}> & insights</Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Get Started Button */}
            <TouchableOpacity style={styles.getStartedButton}>
              <MaterialCommunityIcons name="star" size={18} color="#fff" />
              <Text style={styles.getStartedButtonText}>Get Started Free</Text>
            </TouchableOpacity>

            {/* Perfect For */}
            <View style={styles.standardPerfectForBox}>
              <MaterialCommunityIcons name="star" size={18} color="#FFA500" />
              <Text style={styles.standardPerfectForText}>Perfect for getting started</Text>
            </View>
          </View>

          {/* Pro Plan Card */}
          <View style={styles.proPlanCard}>
            {/* Best Value Badge */}
            <View style={styles.bestValueBadgeContainer}>
              <View style={styles.bestValueBadge}>
                <MaterialCommunityIcons name="check-circle" size={14} color="#fff" />
                <Text style={styles.bestValueBadgeText}>Best Value</Text>
              </View>
            </View>

            {/* Plan Title */}
            <Text style={styles.proPlanTitle}>Pro Plan</Text>

            {/* Free Badge */}
            <View style={styles.proFreeBadgeContainer}>
              <MaterialCommunityIcons name="gift" size={16} color="#fff" />
              <Text style={styles.proFreeBadgeText}>FREE until March 31, 2027</Text>
            </View>

            {/* Price */}
            <View style={styles.proPriceContainer}>
              <Text style={styles.proStrikethroughPrice}>₹1,999</Text>
            </View>
            <View style={styles.proMainPriceContainer}>
              <Text style={styles.proPriceSymbol}>₹</Text>
              <Text style={styles.proPriceAmount}>0</Text>
            </View>
            <Text style={styles.proPriceSubtitle}>No payment required • Launch Offer</Text>

            {/* Regular Price Info */}
            <View style={styles.proRegularPriceBox}>
              <Text style={styles.proRegularPriceText}>Regular price ₹1,999 from April 1, 2027</Text>
            </View>

            {/* Credit Box */}
            <View style={styles.proCreditBoxContainer}>
              <Text style={styles.proCreditBoxNumber}>8</Text>
              <Text style={styles.proCreditBoxLabel}>Credits Included</Text>
              <Text style={styles.proCreditBoxSubtitle}>(Worth ₹1,999 after launch)</Text>
            </View>

            {/* Benefits List */}
            <View style={styles.proBenefitsListContainer}>
              <View style={styles.proBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#165DFC" />
                <Text style={styles.proBenefitListText}>Post 8 job listings</Text>
              </View>
              <View style={styles.proBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#165DFC" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.proBenefitListText}>
                    <Text style={styles.benefitBold}>30-day visibility</Text>
                    <Text style={styles.benefitNormal}> per posting</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.proBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#165DFC" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.proBenefitListText}>
                    Access to <Text style={styles.benefitBold}>qualified candidates</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.proBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#165DFC" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.proBenefitListText}>
                    <Text style={styles.benefitBold}>Application tracking</Text>
                    <Text style={styles.benefitNormal}> dashboard</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.proBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#165DFC" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.proBenefitListText}>
                    <Text style={styles.benefitBold}>Candidate analytics</Text>
                    <Text style={styles.benefitNormal}> & insights</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.proBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#165DFC" />
                <View style={styles.benefitListTextWrapper}>
                  <Text style={styles.proBenefitListText}>
                    <Text style={styles.benefitBold}>Best Value:</Text>
                    <Text style={styles.benefitNormal}> Save ₹665</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.proBenefitListItem}>
                <MaterialCommunityIcons name="check" size={18} color="#165DFC" />
                <Text style={styles.proBenefitListText}>Premium Support</Text>
              </View>
            </View>

            {/* Get Started Button */}
            <TouchableOpacity style={styles.proGetStartedButton}>
              <MaterialCommunityIcons name="star" size={18} color="#fff" />
              <Text style={styles.proGetStartedButtonText}>Get Started Free</Text>
            </TouchableOpacity>

            {/* Best For */}
            <View style={styles.proPerfectForBox}>
              <MaterialCommunityIcons name="fire" size={18} color="#FF3B30" />
              <Text style={styles.proPerfectForText}>Best for active hiring teams</Text>
            </View>
          </View>
        </View>

        {/* Transaction History Section */}
        <View style={styles.transactionHistoryContainer}>
          <View style={styles.transactionHistoryHeader}>
            <View style={styles.transactionHistoryTitleRow}>
              <MaterialCommunityIcons name="history" size={24} color="#333" />
              <Text style={styles.transactionHistoryTitle}>Transaction History</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {/* Empty State */}
          <View style={styles.transactionEmptyState}>
            <MaterialCommunityIcons name="history" size={56} color="#E0E0E0" />
            <Text style={styles.transactionEmptyTitle}>No transactions yet</Text>
            <Text style={styles.transactionEmptySubtitle}>Your credit purchases and usage will appear here</Text>
          </View>
        </View>

        {/* How Credits Work Section */}
        <View style={styles.howCreditsWorkContainer}>
          <Text style={styles.howCreditsWorkTitle}>How Credits Work</Text>

          {/* Benefits List */}
          <View style={styles.howCreditsListContainer}>
            {/* Item 1 */}
            <View style={styles.howCreditsItem}>
              <MaterialCommunityIcons name="check" size={20} color="#00C853" />
              <View style={styles.howCreditsTextContainer}>
                <Text style={styles.howCreditsItemTitle}>
                  <Text style={styles.howCreditsBold}>FREE until March 31, 2027:</Text>
                  <Text style={styles.howCreditsNormal}> All credits are free during our launch period</Text>
                </Text>
              </View>
            </View>

            {/* Item 2 */}
            <View style={styles.howCreditsItem}>
              <MaterialCommunityIcons name="check" size={20} color="#00C853" />
              <View style={styles.howCreditsTextContainer}>
                <Text style={styles.howCreditsItemTitle}>
                  <Text style={styles.howCreditsBold}>Unlimited postings:</Text>
                  <Text style={styles.howCreditsNormal}> Post as many jobs as you want during the free period</Text>
                </Text>
              </View>
            </View>

            {/* Item 3 */}
            <View style={styles.howCreditsItem}>
              <MaterialCommunityIcons name="check" size={20} color="#00C853" />
              <View style={styles.howCreditsTextContainer}>
                <Text style={styles.howCreditsItemTitle}>
                  <Text style={styles.howCreditsBold}>Starting April 1, 2027:</Text>
                  <Text style={styles.howCreditsNormal}> Credits cost applies - 1 credit = 1 job post, credits expire in 90 days</Text>
                </Text>
              </View>
            </View>

            {/* Item 4 */}
            <View style={styles.howCreditsItem}>
              <MaterialCommunityIcons name="check" size={20} color="#00C853" />
              <View style={styles.howCreditsTextContainer}>
                <Text style={styles.howCreditsItemTitle}>
                  <Text style={styles.howCreditsBold}>Admin flexibility:</Text>
                  <Text style={styles.howCreditsNormal}> Admins can manually adjust your credits anytime if needed</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreditsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 36,
  },
  headerTitleSecond: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 36,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    lineHeight: 20,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00C853',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 24,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    gap: 16,
  },
  giftIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginTop: 4,
  },
  offerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
    letterSpacing: 0.5,
  },
  offerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 18,
  },
  offerTitleText: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 22,
  },
  offerTitleSecond: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 22,
  },
  benefitsContainer: {
    gap: 12,
    marginBottom: 18,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  infoBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoBoxTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976D2',
    fontFamily: 'Geist-VariableFont_wght',
  },
  creditPlansContainer: {
    gap: 10,
  },
  creditPlanRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  creditBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333',
    marginTop: 7,
    flexShrink: 0,
  },
  creditPlanText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 18,
    flex: 1,
  },
  creditPlanBold: {
    fontWeight: '600',
    color: '#000',
  },
  creditPlanBasic: {
    fontWeight: '400',
    color: '#666',
  },
  yourCreditsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D0E8FF',
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 24,
  },
  yourCreditsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  yourCreditsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  creditStatCard: {
    backgroundColor: '#E8F4FF',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  creditStatNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  creditStatLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
  },
  creditsStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  creditStatItem: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  creditStatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  creditStatItemLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 6,
    textAlign: 'center',
  },
  creditStatItemValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  planSectionContainer: {
    marginBottom: 24,
  },
  planSectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  planSectionSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 18,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  planBadgeContainer: {
    marginBottom: 16,
  },
  autoAssignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5A6B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  autoAssignedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 12,
  },
  includedBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5A6B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
  },
  includedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  priceSymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  priceSubtitle: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    marginBottom: 16,
  },
  creditBoxContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  creditBoxNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  creditBoxLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
  benefitsListContainer: {
    width: '100%',
    marginBottom: 16,
    gap: 10,
  },
  benefitListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitListTextWrapper: {
    flex: 1,
  },
  benefitListText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 20,
  },
  benefitBold: {
    fontWeight: '600',
    color: '#000',
  },
  benefitNormal: {
    fontWeight: '400',
    color: '#333',
  },
  includedAccountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    gap: 8,
  },
  includedAccountText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
    flex: 1,
  },
  perfectForBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perfectForText: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
  },
  standardPlanCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1ABC9C',
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  mostPopularBadgeContainer: {
    position: 'absolute',
    top: -16,
    alignItems: 'center',
  },
  mostPopularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C853',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  mostPopularBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
  standardPlanTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 12,
    marginTop: 20,
  },
  standardFreeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C853',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
  },
  standardFreeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
  standardPriceContainer: {
    marginBottom: 4,
  },
  strikethroughPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    textDecorationLine: 'line-through',
  },
  standardMainPriceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  standardPriceSymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00C853',
    fontFamily: 'Geist-VariableFont_wght',
  },
  standardPriceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#00C853',
    fontFamily: 'Geist-VariableFont_wght',
  },
  standardPriceSubtitle: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    marginBottom: 12,
  },
  regularPriceBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  regularPriceText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    textAlign: 'center',
  },
  standardCreditBoxContainer: {
    backgroundColor: '#E0F7F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#80E5D8',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  standardCreditBoxNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#00C853',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  standardCreditBoxLabel: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
  },
  standardCreditBoxSubtitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    marginTop: 4,
  },
  standardBenefitsListContainer: {
    width: '100%',
    marginBottom: 16,
    gap: 10,
  },
  standardBenefitListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  standardBenefitListText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 20,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C853',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  getStartedButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
  standardPerfectForBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  standardPerfectForText: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
  },
  proPlanCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#165DFC',
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  bestValueBadgeContainer: {
    position: 'absolute',
    top: -16,
    alignItems: 'center',
  },
  bestValueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#165DFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  bestValueBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
  proPlanTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 12,
    marginTop: 20,
  },
  proFreeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C853',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
  },
  proFreeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
  proPriceContainer: {
    marginBottom: 4,
  },
  proStrikethroughPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999',
    fontFamily: 'Geist-VariableFont_wght',
    textDecorationLine: 'line-through',
  },
  proMainPriceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  proPriceSymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  proPriceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  proPriceSubtitle: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    marginBottom: 12,
  },
  proRegularPriceBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  proRegularPriceText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    textAlign: 'center',
  },
  proCreditBoxContainer: {
    backgroundColor: '#E8F4FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B3D9FF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  proCreditBoxNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  proCreditBoxLabel: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
  },
  proCreditBoxSubtitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    marginTop: 4,
  },
  proBenefitsListContainer: {
    width: '100%',
    marginBottom: 16,
    gap: 10,
  },
  proBenefitListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  proBenefitListText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 20,
  },
  proGetStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#165DFC',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  proGetStartedButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Geist-VariableFont_wght',
  },
  proPerfectForBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proPerfectForText: {
    fontSize: 13,
    color: '#FF3B30',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '600',
  },
  transactionHistoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 24,
  },
  transactionHistoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  transactionHistoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  transactionHistoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#f8f8f8',
  },
  refreshButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
  },
  transactionEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  transactionEmptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 16,
    marginBottom: 8,
  },
  transactionEmptySubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '400',
    textAlign: 'center',
  },
  howCreditsWorkContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 24,
  },
  howCreditsWorkTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 16,
  },
  howCreditsListContainer: {
    gap: 14,
  },
  howCreditsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  howCreditsTextContainer: {
    flex: 1,
  },
  howCreditsItemTitle: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 20,
  },
  howCreditsBold: {
    fontWeight: '600',
    color: '#000',
  },
  howCreditsNormal: {
    fontWeight: '400',
    color: '#333',
  },
})