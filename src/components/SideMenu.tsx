import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DrawerNavigationProp, DrawerContentComponentProps } from '@react-navigation/drawer'
import { useDispatch, useSelector } from 'react-redux'
import * as AsyncStore from '../AsyncStore'
import { clearCoursesData } from '../Redux/slices/coursesSlice'
import { clearEmplloyerAnalyticsData } from '../Redux/slices/employerAnalyticsSlice'
import { clearEmplloyerApplicationsData } from '../Redux/slices/employerApplicationsSlice'
import { clearEmployerCreditsData } from '../Redux/slices/employerCreditsSlice'
import { clearEmployerDashboardData } from '../Redux/slices/employerDashboardSlice'
import { clearEmployerProfileData } from '../Redux/slices/employerProfileSlice'
import { clearHomeData } from '../Redux/slices/homeSlice'
import { clearEmployerJobPostingsData } from '../Redux/slices/jobPostings'
import { clearUserData } from '../Redux/slices/loginSlice'
import { clearProfileData } from '../Redux/slices/profileSlice'
import { clearPaymentData } from '../Redux/slices/paymentsSlice'
import { Shield, ShieldOff } from 'lucide-react-native'


interface MenuItem {
  id: string
  label: string
  url: string
}

const SideMenu: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const [loader, setLoader] = useState(false)
  const insets = useSafeAreaInsets()
  const [role, setRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    LocalStorageaData();
  }, [])
  const selector = useSelector((state: any) => state?.login);
  const menuItems: MenuItem[] = [
    { id: '1', label: 'About us', url: 'https://interviewhighway.com/about' },
    { id: '2', label: 'Acceptable Use Policy', url: 'https://interviewhighway.com/acceptable-use' },
    { id: '3', label: 'Employer Service Agreement', url: 'https://interviewhighway.com/employer-agreement' },
    { id: '4', label: 'Terms of Use', url: 'https://interviewhighway.com/terms' },
    { id: '5', label: 'Privacy Policy', url: 'https://interviewhighway.com/privacy' },
    { id: '6', label: 'Demo', url: 'https://interviewhighway.com/demo' },
  ]

  const handleMenuItemPress = (url: string) => {
    Linking.openURL(url);
    navigation.closeDrawer()
  }

  const handleSignOut = async () => {

    await dispatch(clearEmplloyerAnalyticsData());
    await dispatch(clearEmplloyerApplicationsData());
    await dispatch(clearEmployerCreditsData());
    await dispatch(clearEmployerDashboardData());
    await dispatch(clearEmployerProfileData());
    await dispatch(clearEmployerJobPostingsData());
    await dispatch(clearHomeData());
    await dispatch(clearUserData());
    await dispatch(clearProfileData());
    await dispatch(clearPaymentData());
    await dispatch(clearCoursesData());

    await AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, '');
    await AsyncStore.storeData(AsyncStore.Keys.USER_DATA, '');
    await AsyncStore.storeData(AsyncStore.Keys.IS_VERIFIED, '');
    await AsyncStore.storeData(AsyncStore.Keys.USER_ID, '');
    await AsyncStore.storeData(AsyncStore.Keys.ROLE, '');
    await AsyncStore.storeData(AsyncStore.Keys.EMP_ID, '');
    await AsyncStore.storeData(AsyncStore.Keys.ORG_ID, '');
    await AsyncStore.storeData(AsyncStore.Keys.IS_LOGIN, 'false');
    navigation.closeDrawer();

  }

  //get user data from async storage and set it to state
  const LocalStorageaData = async () => {
    try {
      const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);
      const userRole = await AsyncStore.getData(AsyncStore?.Keys?.ROLE);
      const verify = await AsyncStore.getData(AsyncStore?.Keys?.IS_VERIFIED);
      setIsVerified(verify === 'true');
      if (userLoggedInData) {
        const parsedUserData = JSON.parse(userLoggedInData);
        setUserName(parsedUserData?.user_metadata?.full_name || null);
        setEmail(parsedUserData?.email || null)
        console.log('User data from AsyncStorage:', parsedUserData);
      }
      if (userRole) {
        setRole(userRole);
        console.log('User role from AsyncStorage:', userRole);
      }
    } catch (error) {
      console.log("Error fetching user data from AsyncStorage:", error);
    }
  }

  return (
    <ScrollView style={[styles.menuPanel, { paddingTop: insets.top + 16 }]} scrollEnabled={false}>
      {/* Header */}
      <View style={styles.menuHeader}>
        <Text style={styles.menuTitle}>Menu</Text>
      </View>

      {/* User Profile Section */}
      <View style={styles.userSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{email ? email.charAt(0).toUpperCase() : 'IH'}</Text>
        </View>
        <View style={styles.userInfo}>
          {role !== 'employer' &&
            <Text style={styles.userName}>{userName}</Text>
          }
          <Text style={styles.userEmail}>{email}</Text>
          {
            role !== 'employer' ? (
              <View style={styles.userStatusContainer}>
                {isVerified ? (
                  <Shield color={'#00A746'} size={16} />
                ) : (
                  <ShieldOff color={'#FF2434'} size={16} />
                )}
                <Text style={isVerified ? styles.userStatus : styles.userStatusNotVerified}>
                  {isVerified ? 'Verified' : 'Not Verified'}
                </Text>
              </View>
            ) : null
          }

        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuItemsContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item.url)}
          >
            <Text style={styles.menuItemText}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutIcon}>➤</Text>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default SideMenu

const styles = StyleSheet.create({
  menuPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  menuHeader: {
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#165DFC',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  userStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userStatus: {
    fontSize: 12,
    color: '#00A746',
    fontFamily: 'Geist-VariableFont_wght',
  },
  userStatusNotVerified: {
    fontSize: 12,
    color: '#FF2434',
    fontFamily: 'Geist-VariableFont_wght',
  },
  menuItemsContainer: {
    gap: 12,
    marginBottom: 'auto',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  menuItemText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
  signOutContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 'auto',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF2434',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  signOutIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
})
