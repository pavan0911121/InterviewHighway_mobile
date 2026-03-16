import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../types/navigation';

type Props = BottomTabScreenProps<BottomTabParamList, 'HomeTab'>;

export default function HomeTabScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Tab</Text>
      <Text style={styles.subtitle}>Welcome to Interview Highway!</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Switch to Profile Tab"
          onPress={() => navigation.navigate('ProfileTab')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
});