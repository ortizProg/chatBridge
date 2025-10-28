import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Platform, // Necesario para el date picker
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, GLOBAL } from '../styles/styles';
import { Ionicons } from "@expo/vector-icons"; 

// Componente Custom Input para evitar repetir estilos
const CustomInput = ({ label, placeholder, isRequired = false, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.inputLabel, GLOBAL.text]}>
      {label}{isRequired && <Text style={{ color: COLORS.accent }}>*</Text>}
    </Text>
    <TextInput
      style={[styles.input, GLOBAL.text]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textSecondary || '#aaa'}
      {...props}
    />
  </View>
);

// --- Pantalla Crear Evento ---
export default function CreateEventScreen({ navigation }) {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

  const handleCreateEvent = () => {
    // 1. Validar campos requeridos (Nombre, Descripción, Dirección, Fecha)
    if (!eventName || !description || !address || !dateTime) {
      alert('Por favor, complete todos los campos requeridos (*).');
      return;
    }
    
    // 2. Lógica para enviar el evento al servidor (API Call)
    console.log('Creando evento con datos:', { eventName, description, address, dateTime, maxCapacity });
    
    // 3. Navegar o cerrar el modal
    // navigation.goBack(); // O navegar a la lista de eventos
  };

  return (
    // SafeAreaView para manejar las áreas seguras (notch)
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- Encabezado del Modal con Botón Cerrar (x) --- */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, GLOBAL.text]}>Crear Evento</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* --- Formulario --- */}
        <ScrollView 
          style={styles.formScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          
          <CustomInput 
            label="Nombre"
            placeholder="Introduce el nombre del evento"
            isRequired
            value={eventName}
            onChangeText={setEventName}
          />
          
          <CustomInput 
            label="Descripción"
            placeholder="Detalles sobre el evento"
            isRequired
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            style={styles.multilineInput} // Estilo para altura
          />
          
          <CustomInput 
            label="Dirección"
            placeholder="Lugar o punto de encuentro"
            isRequired
            value={address}
            onChangeText={setAddress}
          />

          {/* Campo de Fecha y Hora */}
          {/* Nota: En una app real, aquí usarías un DatePicker nativo */}
          <CustomInput 
            label="Fecha y hora"
            placeholder="__/__/__, __:__"
            isRequired
            value={dateTime}
            onChangeText={setDateTime}
          />

          <CustomInput 
            label="Aforo máximo"
            placeholder="Número de personas (opcional)"
            keyboardType="numeric"
            value={maxCapacity}
            onChangeText={setMaxCapacity}
          />
          
        </ScrollView>
        
        {/* --- Botón de Crear Evento --- */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
          <Text style={styles.createButtonText}>Crear evento</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// --- Estilos de la Pantalla ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20, // Padding inferior para el botón
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface || '#333', // Línea separadora
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  closeButton: {
    padding: 5,
  },
  
  // --- Estilos del Formulario ---
  formScroll: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    paddingBottom: 20, // Espacio extra al final de la lista
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
    // Estilo general del TextInput
    backgroundColor: COLORS.surface || '#222', 
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  multilineInput: {
    height: Platform.OS === 'ios' ? 100 : 100, // Altura para multilínea
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  // --- Estilo del Botón de Acción ---
  createButton: {
    backgroundColor: COLORS.primary, // Color principal para el botón de acción
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10, // Separación del formulario
  },
  createButtonText: {
    color: COLORS.background, // Color de texto que contraste con COLORS.primary
    fontSize: 18,
    fontWeight: 'bold',
  },
});