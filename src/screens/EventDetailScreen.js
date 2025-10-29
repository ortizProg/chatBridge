import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  ImageBackground, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GLOBAL } from '../styles/styles'; 

// Componente para mostrar un asistente
const AttendeeItem = ({ name }) => (
  <View style={styles.attendeeItem}>
    {/* Avatar de ejemplo */}
    <View style={styles.avatarPlaceholder}>
      <Text style={styles.avatarText}>{name[0]}</Text>
    </View>
    <Text style={[styles.attendeeName, GLOBAL.text]}>{name}</Text>
  </View>
);

// Componente principal de la pantalla de detalle
export default function EventDetailScreen({ route, navigation }) {
  // Obtenemos los datos del evento pasados desde EventsScreen
  const { event } = route.params; 
  
  // Estado para simular si el usuario ya asiste
  const [isAttending, setIsAttending] = useState(false);
  const [attendeesList, setAttendeesList] = useState([
    { id: 'u1', name: 'Juan Perez' },
    { id: 'u2', name: 'Maria Lopez' },
    { id: 'u3', name: 'Pedro García' },
    // Más asistentes simulados
  ]);
  
  // Estado para los likes/interacciones
  const [likesCount, setLikesCount] = useState(event.likes);

  // Lógica para asistir/cancelar
  const handleToggleAttendance = () => {
    setIsAttending(prev => !prev);
    // Lógica para actualizar en Firestore aquí
  };

  // Simular la funcionalidad del botón de mapa/ubicación
  const handleMapPress = () => {
    console.log(`Abriendo mapa para la ubicación: ${event.location}`);
    // En una app real: Linking.openURL('geo:0,0?q=' + event.location);
  };
  
  const handleLikePress = () => {
    setLikesCount(prev => prev + (isLiked ? -1 : 1));
    // Lógica de like en el backend
    setIsLiked(prev => !prev);
  }
  
  const [isLiked, setIsLiked] = useState(false); // Simulación de estado de like

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* --- Imagen de Encabezado y Botón de Retroceso --- */}
        <ImageBackground source={{ uri: event.imageUrl }} style={styles.imageHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.background} />
          </TouchableOpacity>
        </ImageBackground>
        
        <View style={styles.contentContainer}>
          {/* --- Título y Alertas (Campana) --- */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, GLOBAL.text]}>{event.title}</Text>
            <TouchableOpacity style={styles.alertButton}>
              <Ionicons name="notifications-outline" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* --- Información Básica (Ubicación y Fecha) --- */}
          <View style={styles.infoContainer}>
            <Ionicons name="pin" size={18} color={COLORS.textSecondary} />
            <Text style={[styles.infoText, GLOBAL.textSecondary]}>{event.location}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Ionicons name="calendar" size={18} color={COLORS.textSecondary} />
            <Text style={[styles.infoText, GLOBAL.textSecondary]}>{event.date}</Text>
          </View>
          
          {/* --- Descripción --- */}
          <Text style={[styles.sectionTitle, GLOBAL.text]}>Descripción</Text>
          <Text style={[styles.description, GLOBAL.text]}>
            En este espacio recreativo nos reuniremos al sobre la piedras del río para tomar clases de inglés y divertirnos un rato.
            Esta descripción es un poco más larga para mostrar cómo se ve el texto. Podríamos añadir más detalles sobre lo que se necesita llevar o los objetivos del encuentro.
          </Text>
          
          {/* --- Asistentes y Likes (Diseño del Wireframe) --- */}
          <View style={styles.interactionBar}>
            {/* Asistentes (Personas) */}
            <View style={styles.iconCount}>
              <Ionicons name="people" size={20} color={COLORS.text} />
              <Text style={[styles.countText, GLOBAL.text]}>{attendeesList.length}</Text>
            </View>
            
            {/* Likes (Corazón) */}
            <TouchableOpacity onPress={handleLikePress} style={styles.iconCount}>
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={20} 
                color={isLiked ? COLORS.accent : COLORS.text} 
              />
              <Text style={[styles.countText, GLOBAL.text]}>{likesCount}</Text>
            </TouchableOpacity>
          </View>

          {/* --- Botón de Acción (Asistir/Cancelar) --- */}
          <TouchableOpacity 
            style={[styles.actionButton, isAttending && styles.cancelButton]} 
            onPress={handleToggleAttendance}
          >
            <Text style={styles.actionButtonText}>
              {isAttending ? 'Cancelar asistencia' : 'Asistir'}
            </Text>
          </TouchableOpacity>
          
          {/* --- Lista de Asistentes --- */}
          <Text style={[styles.sectionTitle, styles.attendeesSection, GLOBAL.text]}>Asistentes ({attendeesList.length})</Text>
          <View style={styles.attendeesContainer}>
            {attendeesList.map(attendee => (
              <AttendeeItem key={attendee.id} name={attendee.name} />
            ))}
          </View>
          
          {/* --- Botón de Ubicación del Mapa --- */}
          <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
            <Ionicons name="map" size={24} color={COLORS.background} />
          </TouchableOpacity>
          
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // --- Encabezado de Imagen ---
  imageHeader: {
    width: '100%',
    height: 250, 
    justifyContent: 'flex-start',
    padding: 16,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: -5, // Ajuste visual
  },
  
  contentContainer: {
    padding: 16,
  },
  
  // --- Título ---
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    flexShrink: 1, // Permite que el texto se encoja para dejar espacio al botón
  },
  alertButton: {
    padding: 5,
  },
  
  // --- Info ---
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
    color: COLORS.textSecondary,
  },
  
  // --- Descripción ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: 20,
  },
  
  // --- Barra de Interacción (Likes/Asistentes) ---
  interactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.surface || '#333',
    marginBottom: 20,
  },
  iconCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  countText: {
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '600',
    color: COLORS.text,
  },

  // --- Botón de Acción ---
  actionButton: {
    backgroundColor: COLORS.accent, 
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: COLORS.surface || '#333',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  actionButtonText: {
    color: COLORS.background, 
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // --- Lista de Asistentes ---
  attendeesSection: {
    marginTop: 10,
  },
  attendeesContainer: {
    // Estilos para la lista de asistentes si fuera horizontal o grid
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: 18,
  },
  attendeeName: {
    fontSize: 16,
    color: COLORS.text,
  },

  // --- Botón Flotante de Mapa ---
  mapButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  }
});
