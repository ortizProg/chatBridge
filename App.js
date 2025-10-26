import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/authContext';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <LoginScreen></LoginScreen>
        {/* <AppNavigator /> */}
        <StatusBar style="auto" />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
