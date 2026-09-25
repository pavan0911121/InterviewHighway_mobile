import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Skeleton from 'react-native-reanimated-skeleton';

const JobsSkeleton = () => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']} accessible accessibilityLabel="Loading jobs" accessibilityState={{ busy: true }}>
      <View style={styles.scrollContent}>
        <Skeleton
          containerStyle={styles.headerSection}
          isLoading={true}
          animationDirection="horizontalRight"
          boneColor="#F3F4F6"
          highlightColor="#FAFAFB"
          layout={[{ key: 'title', width: '70%', height: 50, borderRadius: 10 }]}
        />

        <View style={styles.cardsContainer}>
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton
              key={index}
              containerStyle={styles.card}
              isLoading={true}
              animationDirection="horizontalRight"
              boneColor="#F3F4F6"
              highlightColor="#FAFAFB"
              layout={[{ key: `card-${index}`, width: '100%', height: 100, borderRadius: 12 }]}
            />
          ))}
        </View>

        <Skeleton
          containerStyle={styles.expanded}
          isLoading={true}
          animationDirection="horizontalRight"
          boneColor="#F3F4F6"
          highlightColor="#FAFAFB"
          layout={[{ key: 'search-bar', width: '100%', height: 220, borderRadius: 12, marginBottom: 16 }]}
        />

        <Skeleton
          containerStyle={styles.expanded}
          isLoading={true}
          animationDirection="horizontalRight"
          boneColor="#F3F4F6"
          highlightColor="#FAFAFB"
          layout={[{ key: 'job-card', width: '100%', height: 260, borderRadius: 12 }]}
        />
      </View>
    </SafeAreaView>
  );
};

export default JobsSkeleton;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop:10,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  content: {
    paddingTop: 0,
    paddingBottom: 20,
  },
  expanded: {
    width: '100%',
  },
  headerSection: {
    marginBottom: 24,
  },
  cardsContainer: {
    columnGap: 16,
    rowGap: 16,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: '47%',
    height: 100,
  },
});