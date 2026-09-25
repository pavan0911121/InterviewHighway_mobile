import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Skeleton from 'react-native-reanimated-skeleton';

const CompanyProfileSkeleton = () => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']} accessible accessibilityLabel="Loading company profile" accessibilityState={{ busy: true }}>
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Skeleton
          containerStyle={styles.expanded}
          isLoading={true}
          animationDirection="horizontalRight"
          boneColor="#F3F4F6"
          highlightColor="#FAFAFB"
          layout={[{ key: 'header-card', width: '100%', height: 250, borderRadius: 16, marginBottom: 24 }]}
        />

        <Skeleton
          containerStyle={styles.expanded}
          isLoading={true}
          animationDirection="horizontalRight"
          boneColor="#F3F4F6"
          highlightColor="#FAFAFB"
          layout={[{ key: 'details-card', width: '100%', height: 1120, borderRadius: 16 }]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompanyProfileSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  expanded: {
    width: '100%',
  },
});