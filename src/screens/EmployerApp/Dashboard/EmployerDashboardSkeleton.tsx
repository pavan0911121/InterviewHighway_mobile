import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Skeleton from 'react-native-reanimated-skeleton';

const EmployerDashboardSkeleton = () => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']} accessible accessibilityLabel="Loading dashboard" accessibilityState={{ busy: true }}>
      {/* <View style={styles.header}> */}
        {/* <Skeleton
          containerStyle={styles.headerBone}
          isLoading={true}
          animationDirection="horizontalRight"
          boneColor="#F3F4F6"
          highlightColor="#FAFAFB"
          layout={[{ key: 'menu', width: 40, height: 40, borderRadius: 8 }]}
        /> */}
      {/* </View> */}

      <View style={styles.scrollContent}  >
        <Skeleton
          containerStyle={styles.welcomeSection}
          isLoading={true}
          animationDirection="horizontalRight"
          boneColor="#F3F4F6"
          highlightColor="#FAFAFB"
          layout={[
            { key: 'welcome-title', width: '70%', height: 50, borderRadius: 10, marginBottom: 8 },
          ]}
        />

        <View style={styles.cardsContainer}>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton
              key={index}
              containerStyle={styles.card}
              isLoading={true}
              animationDirection="horizontalRight"
              boneColor="#F3F4F6"
              highlightColor="#FAFAFB"
              layout={[
                {
                  key: `card-header-${index}`,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                  children: [
                    { key: `card-label-${index}`, width: '55%', height: 14, borderRadius: 3 },
                    { key: `card-icon-${index}`, width: 25, height: 25, borderRadius: 6 },
                  ],
                },
                { key: `card-value-${index}`, width: '40%', height: 28, borderRadius: 4, marginBottom: 8 },
                { key: `card-subtext-${index}`, width: '65%', height: 13, borderRadius: 3 },
              ]}
            />
          ))}
        </View>

        <Skeleton
          containerStyle={styles.expanded}
          isLoading={true}
          animationDirection="horizontalRight"
          boneColor="#F3F4F6"
          highlightColor="#FAFAFB"
          layout={[{ key: 'summary-card', width: '100%', height: 100, borderRadius: 12 }]}
        />
      </View>
    </SafeAreaView>
  );
};

export default EmployerDashboardSkeleton;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffff',
    marginTop: 0,
  },
  headerBone: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    marginVertical: 0,
  },
  
  expanded: {
    width: '100%',
  },
  welcomeSection: {
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
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '47%',
    minHeight: 176,
  },
});