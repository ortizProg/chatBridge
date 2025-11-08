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
  ActivityIndicator 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, GLOBAL } from '../styles/styles';
// ¡Importaciones clave añadidas!
import { useEvents } from '../context/EventContext';
import { useNavigation } from '@react-navigation/native';

// El componente CustomInput no cambia
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

export default function EventForm() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // --- Hooks necesarios ---
  const { createEvent } = useEvents(); // 1. Obtenemos la función del context
  const navigation = useNavigation(); // 2. Obtenemos la navegación

  // --- Lógica de publicación ---
  const handlePublish = async () => {
    // 3. Validación de campos obligatorios
    if (!title.trim() || !description.trim() || !address.trim() || !date.trim() || !time.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios (*).');
      return;
    }

    setSubmitting(true);

    // 4. Llamamos a la función del context con todos los estados
    const result = await createEvent(
      title, 
      description, 
      address, 
      date, 
      time, 
      maxCapacity // maxCapacity es opcional, el context lo maneja
    );

    setSubmitting(false);

    // 5. Manejamos la respuesta
    if (result.success) {
      Alert.alert('Éxito', result.message || 'Evento creado correctamente.');
      
      // Limpiamos el formulario
      setTitle('');
      setDescription('');
      setAddress('');
      setDate('');
      setTime('');
      setMaxCapacity('');
      
      // 6. Navegamos a la pantalla de eventos (ajusta 'EventsScreen' si se llama diferente)
      navigation.navigate('Events'); 
    } else {
      // Mostramos el error que viene del context
      Alert.alert('Error', result.message || 'No se pudo crear el evento. Inténtalo de nuevo.');
    }
  };

  // El JSX no necesita cambios, solo se actualiza la función onPress
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text style={[styles.headerTitle, GLOBAL.text]}>Crear Evento</Text>

      <ScrollView
        style={styles.formScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
        onPress={handlePublish} // ¡Esta es la función que actualizamos!
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

// Los estilos no cambian
const styles = StyleSheet.create({
  container: {
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