import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DrawerNavigationProp, DrawerContentComponentProps } from '@react-navigation/drawer'

interface MenuItem {
  id: string
  label: string
  url: string
}

const SideMenu: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets()

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

  const handleSignOut = () => {
    navigation.closeDrawer()
    // Handle sign out logic here
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
          <Text style={styles.avatarText}>PA</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>pavan</Text>
          <Text style={styles.userEmail}>pavankarthik901@gmail.com</Text>
          <Text style={styles.userStatus}>⭕ Not Verified</Text>
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
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 12,
    color: '#999',
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
