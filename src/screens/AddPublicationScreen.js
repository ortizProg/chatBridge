import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, GLOBAL } from '../styles/styles';
import PublicationForm from '../components/PublicationForm'; 
export default function AddPublicationScreen() {

  return (
    <View style={styles.container}>
      <Text style={[styles.header, GLOBAL.text]}>Nueva Publicación</Text>
      <PublicationForm  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
    paddingHorizontal: 16, 
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
