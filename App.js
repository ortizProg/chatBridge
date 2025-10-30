import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { PostProvider } from './src/context/PostContext'; 

export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <View style={styles.container}>
          <AppNavigator />
          <StatusBar style="light" />
        </View>
      </PostProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
