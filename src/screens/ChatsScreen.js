import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS, GLOBAL } from '../styles/styles';

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, GLOBAL.text]}>Próximamente mis post</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  text: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: COLORS.primary, 
    textAlign: "center",
  },
});
