import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import * as AsyncStore from "../../../AsyncStore";
import { useDispatch, useSelector } from 'react-redux'
import { getEmployerDashboardStats } from '../../../Redux/slices/employerDashboardSlice'
import { Briefcase, CircleCheckBig, Clock4, Users } from 'lucide-react-native'

const EmployerDashboardScreen = () => {
  const navigation = useNavigation()
const dispatch = useDispatch();
  const selector = useSelector((state: any) => state.employerDashboard);

  useEffect(() => {
    LocalStorageaData();
  }, [])

  //get user data from async storage and set it to state
  const [userId, setUserId] = useState(null);
  const LocalStorageaData = async () => {
    try {
     const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);
     if(userLoggedInData){
      const parsedUserData = JSON.parse(userLoggedInData);
      const userId = parsedUserData?.id || null;
      const response = await dispatch(getEmployerDashboardStats(userId) as any);
        
     }
      if (userId) {
        setUserId(userId);
      }
    } catch (error) {
      console.log("Error fetching user data from AsyncStorage:", error);
    }
  }
  
  // Sample data - replace with API data later
  // const [companyData] = useState(selector[0]?.data)
  const dashboardStats = selector.data;
  console.log(selector?.transactions,"dashboardStats");
  
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

      {/* Main Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome back, {dashboardStats?.companyName}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Here's an overview of your recruitment activities
          </Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.cardsContainer}>
          {/* Total Jobs Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Total Jobs</Text>
              <View style={[styles.cardIcon, styles.iconBlue]}>
                <Briefcase color={'#005FFF'}/>
              </View>
            </View>
            <Text style={styles.cardValue}>{dashboardStats?.totalJobs}</Text>
            <Text style={styles.cardSubtext}>{dashboardStats?.activeJobs} active</Text>
          </View>

          {/* Total Applications Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Total Applications</Text>
              <View style={[styles.cardIcon, styles.iconPurple]}>
                 <Users color={'#A800FF'}/>
              </View>
            </View>
            <Text style={styles.cardValue}>{dashboardStats?.totalApplications}</Text>
            <Text style={styles.cardSubtext}>{dashboardStats?.pendingApplications} pending review</Text>
          </View>

          {/* Shortlisted Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Shortlisted</Text>
              <View style={[styles.cardIcon, styles.iconYellow]}>
                 <Clock4 color={'#DC8400'}/>
              </View>
            </View>
            <Text style={styles.cardValue}>{dashboardStats?.shortlistedCount}</Text>
            <Text style={styles.cardSubtext}>Candidates in pipeline</Text>
          </View>

          {/* Hired Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Hired</Text>
              <View style={[styles.cardIcon, styles.iconGreen]}>
                  <CircleCheckBig color={'#00A746'}/>
              </View>
            </View>
            <Text style={styles.cardValue}>{dashboardStats?.hiredCount}</Text>
            <Text style={styles.cardSubtext}>{dashboardStats?.conversionRate}% conversion rate</Text>
          </View>
        </View>

        {/* No Applications Yet Section */}
        <View style={styles.emptyStateCard}>
          <View style={styles.emptyStateIconContainer}>
            <Users color={'#98A1AE'}/>
          </View>
          <Text style={styles.emptyStateTitle}>No applications yet</Text>
          <Text style={styles.emptyStateDescription}>
            Applications will appear here once candidates start applying to your jobs.
          </Text>
          <TouchableOpacity style={styles.postJobButton}>
            <Text style={styles.postJobButtonText}>Post a Job</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EmployerDashboardScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    
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
    paddingVertical: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    fontFamily: 'Geist-VariableFont_wght',
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBlue: {
    backgroundColor: '#E0E7FF',
  },
  iconPurple: {
    backgroundColor: '#F3E8FF',
  },
  iconYellow: {
    backgroundColor: '#FEF3C7',
  },
  iconGreen: {
    backgroundColor: '#D1FAE5',
  },
  iconText: {
    fontSize: 24,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: '#999999',
    fontFamily: 'Geist-VariableFont_wght',
  },
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  emptyStateIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateIcon: {
    fontSize: 36,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginBottom: 16,
  },
  postJobButton: {
    backgroundColor: '#165DFC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  postJobButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
})