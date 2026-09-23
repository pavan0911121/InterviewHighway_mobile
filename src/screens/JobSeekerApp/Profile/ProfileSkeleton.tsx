import { ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import Skeleton from 'react-native-reanimated-skeleton'

const ProfileSkeleton = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      accessible
      accessibilityLabel="Loading profile"
      accessibilityState={{ busy: true }}
    >
      <Skeleton
        containerStyle={styles.layout}
        isLoading={true}
        animationDirection="horizontalRight"
        boneColor="#F3F4F6"
        highlightColor="#FAFAFB"
        layout={[
          { key: 'profile-avatar', width: 100, height: 100, borderRadius: 10, alignSelf: 'center', marginBottom: 28 },
          { key: 'profile-title', width: '100%', height: 60, borderRadius: 10, marginBottom: 24 },
          { key: 'profile-subtitle', width: '32.5%', height: 30, borderRadius: 10, alignSelf: 'center', marginBottom: 18 },
          { key: 'profile-description', width: '64%', height: 50, borderRadius: 10, alignSelf: 'center', marginBottom: 15 },
          { key: 'profile-description', width: '64%', height: 20, borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
          {
            key: 'profile-details',
            width: '68.5%',
            alignSelf: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 30,
            children: [
              { key: 'profile-detail-left-top', width: '48%', height: 30, borderRadius: 10, },
              { key: 'profile-detail-right-bottom', width: '48%', height: 30, borderRadius: 10 },
            ],
          },
          { key: 'profile-content', width: '96%', height: 100, borderRadius: 10, alignSelf: 'center' },
        ]}
      />
    </ScrollView>
  )
}

export default ProfileSkeleton

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 34,
    paddingTop: 30,
    paddingBottom: 32,
  },
  layout: {
    width: '100%',
  },
})