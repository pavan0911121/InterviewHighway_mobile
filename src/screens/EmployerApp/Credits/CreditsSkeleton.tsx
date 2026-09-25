import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Skeleton from 'react-native-reanimated-skeleton';

interface CreditsSkeletonProps {
  transactions?: boolean;
}

const CreditsSkeleton = ({ transactions = false }: CreditsSkeletonProps) => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']} accessible accessibilityLabel={transactions ? 'Loading transactions' : 'Loading credits'} accessibilityState={{ busy: true }}>
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {transactions ? (
          Array.from({ length: 2 }, (_, index) => (
            <Skeleton
              key={index}
              containerStyle={styles.transactionCard}
              isLoading={true}
              animationDirection="horizontalRight"
              boneColor="#F3F4F6"
              highlightColor="#FAFAFB"
              layout={[{ key: `transaction-badge-${index}`, width: '40%', height: '82%', borderRadius: 16 }]}
            />
          ))
        ) : (
          <>
            <Skeleton
              containerStyle={styles.expanded}
              isLoading={true}
              animationDirection="horizontalRight"
              boneColor="#F3F4F6"
              highlightColor="#FAFAFB"
              layout={[{ key: 'offer-card', width: '100%', height: 400, borderRadius: 16, marginBottom: 16 }]}
            />
            <Skeleton
              containerStyle={styles.expanded}
              isLoading={true}
              animationDirection="horizontalRight"
              boneColor="#F3F4F6"
              highlightColor="#FAFAFB"
              layout={[{ key: 'offer-card', width: '100%', height: 400, borderRadius: 16, marginBottom: 16 }]}
            />
            <Skeleton
              containerStyle={styles.expanded}
              isLoading={true}
              animationDirection="horizontalRight"
              boneColor="#F3F4F6"
              highlightColor="#FAFAFB"
              layout={[{ key: 'offer-card', width: '100%', height: 400, borderRadius: 16, marginBottom: 16 }]}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreditsSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    marginTop: 16,
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
  transactionCard: {
    width: '100%',
    height: 660,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 24,
  },
});