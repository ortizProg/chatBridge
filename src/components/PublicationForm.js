import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, GLOBAL } from '../styles/styles';

export default function PublicationForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={[GLOBAL.card, styles.input]}
        placeholder="Título"
        placeholderTextColor={COLORS.textSecondary}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[GLOBAL.card, styles.input, styles.textArea]}
        placeholder="Descripción"
        placeholderTextColor={COLORS.textSecondary}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} >
        <Text style={[styles.buttonText, GLOBAL.text]}>Crear</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    padding: 12,
    marginBottom: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
