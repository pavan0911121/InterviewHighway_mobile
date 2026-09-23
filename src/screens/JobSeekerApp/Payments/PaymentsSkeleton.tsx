import { ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import Skeleton from 'react-native-reanimated-skeleton'

const PaymentsSkeleton = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      accessible
      accessibilityLabel="Loading payments"
      accessibilityState={{ busy: true }}
    >
      <Skeleton
        containerStyle={styles.layout}
        isLoading={true}
        animationDirection="horizontalRight"
        boneColor="#F3F4F6"
        highlightColor="#FAFAFB"
        layout={[
          { key: 'payment-first', width: '100%', height: 80, borderRadius: 10, marginBottom: 20 },
          { key: 'payment-second', width: '100%', height: 80, borderRadius: 10, marginBottom: 20 },
          { key: 'payment-third', width: '100%', height: 80, borderRadius: 10, marginBottom: 20 },
          { key: 'payment-fourth', width: '100%', height: 80, borderRadius: 10, marginBottom: 20, marginTop: 60 },
          { key: 'payment-fifth', width: '100%', height: 80, borderRadius: 10 },
        ]}
      />
    </ScrollView>
  )
}

export default PaymentsSkeleton

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 34,
    paddingTop: 20,
    paddingBottom: 32,
  },
  layout: {
    width: '100%',
  },
})