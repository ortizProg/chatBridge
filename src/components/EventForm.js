import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  Image // Importado para la previsualización
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, GLOBAL } from '../styles/styles';
import { useEvents } from '../context/EventContext';
import { useNavigation } from '@react-navigation/native';
// Importar íconos y el ImagePicker
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// --- Componente CustomInput (Asumiendo que está en este archivo) ---
const CustomInput = ({ label, placeholder, isRequired = false, style, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.inputLabel, GLOBAL.text]}>
      {label}{isRequired && <Text style={{ color: COLORS.accent }}>*</Text>}
    </Text>
    <TextInput
      style={[styles.input, style, GLOBAL.text]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textSecondary || '#888'}
      {...props}
    />
  </View>
);

// --- Componente Principal EventForm ---
export default function EventForm() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Estado para la URI de la imagen seleccionada
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  const { createEvent } = useEvents();
  const navigation = useNavigation();

  // Función para seleccionar la imagen
  const pickImage = async () => {
    // Pedir permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos permiso para acceder a la galería.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // Aspecto panorámico para portadas
      quality: 0.7, // Comprimir para subidas más rápidas
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  // Lógica de publicación (Actualizada)
  const handlePublish = async () => {
    // Validación (incluir la imagen)
    if (!title.trim() || !description.trim() || !address.trim() || !date.trim() || !time.trim() || !selectedImageUri) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios (*) y selecciona una foto de portada.');
      return;
    }

    setSubmitting(true);

    // Llamar a createEvent con la URI de la imagen
    const result = await createEvent(
      title,
      description,
      address,
      date,
      time,
      maxCapacity,
      selectedImageUri // Pasar la URI
    );

    setSubmitting(false);

    if (result.success) {
      Alert.alert('Éxito', result.message || 'Evento creado correctamente.');

      // Limpiar formulario
      setTitle('');
      setDescription('');
      setAddress('');
      setDate('');
      setTime('');
      setMaxCapacity('');
      setSelectedImageUri(null); // Limpiar la imagen

      navigation.navigate('Events');
    } else {
      Alert.alert('Error', result.message || 'No se pudo crear el evento. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text style={[styles.headerTitle, GLOBAL.text]}>Crear Evento</Text>

      <ScrollView
        style={styles.formScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* BLOQUE DEL SELECTOR DE IMAGEN */}
        <Text style={[styles.inputLabel, GLOBAL.text]}>
          Foto de Portada<Text style={{ color: COLORS.accent }}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={pickImage}
          disabled={submitting}
        >
          {selectedImageUri ? (
            // Previsualización si la imagen está seleccionada
            <Image source={{ uri: selectedImageUri }} style={styles.imagePreview} />
          ) : (
            // Botón placeholder si no hay imagen
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={40} color={COLORS.textSecondary} />
              <Text style={[styles.imagePlaceholderText, GLOBAL.textSecondary]}>Seleccionar imagen</Text>
            </View>
          )}
        </TouchableOpacity>

        <CustomInput
          label="Título"
          placeholder="Introduce el título del evento"
          isRequired
          value={title}
          onChangeText={setTitle}
          editable={!submitting}
        />

        <CustomInput
          label="Descripción"
          placeholder="Detalles del evento"
          isRequired
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
          editable={!submitting}
          style={styles.multilineInput}
        />

        <CustomInput
          label="Dirección"
          placeholder="Lugar o punto de encuentro"
          isRequired
          value={address}
          onChangeText={setAddress}
          editable={!submitting}
        />

        <CustomInput
          label="Fecha"
          placeholder="Selecciona la fecha (Ej: 28/10/2025)"
          isRequired
          value={date}
          onChangeText={setDate}
          editable={!submitting}
        />

        <CustomInput
          label="Hora"
          placeholder="Selecciona la hora (Ej: 21:30)"
          isRequired
          value={time}
          onChangeText={setTime}
          editable={!submitting}
        />

        <CustomInput
          label="Aforo máximo"
          placeholder="Número de personas (opcional)"
          keyboardType="numeric"
          value={maxCapacity}
          onChangeText={setMaxCapacity}
          editable={!submitting}
        />
      </ScrollView>

      <TouchableOpacity
        style={[styles.createButton, submitting && styles.buttonDisabled]}
        onPress={handlePublish}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.createButtonText}>Publicar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  Container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 16,
  },
  formScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.primary,
  },
  input: {
    backgroundColor: COLORS.surface || '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text || '#fff',
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    color: COLORS.text || '#fff',
  },

  // --- Estilos para el Selector de Imagen ---
  imagePicker: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    backgroundColor: COLORS.surface || '#2a2a2a',
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textSecondary + '60', // Borde sutil
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imagePlaceholderText: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // --- Fin de Estilos de Imagen ---

  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});