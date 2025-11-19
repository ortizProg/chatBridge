import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { PostProvider } from './src/context/PostContext'; 
import { EventProvider } from './src/context/EventContext';
import { NotificationProvider } from './src/context/NotificationContext';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <PostProvider>
          <EventProvider>
            <View style={styles.container}>
              <AppNavigator />
              <StatusBar style="light" />
            </View>
          </EventProvider>
        </PostProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});