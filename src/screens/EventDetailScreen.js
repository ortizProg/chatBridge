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
// Importamos useEvents si planeamos integrar la interacción con Firestore (likes/asistencia)
// import { useEvents } from '../context/EventContext'; 


const AttendeeItem = ({ name }) => (
  <View style={styles.attendeeItem}>

    <View style={styles.avatarPlaceholder}>
      <Text style={styles.avatarText}>{name[0]}</Text>
    </View>
    <Text style={[styles.attendeeName, GLOBAL.text]}>{name}</Text>
  </View>
);


export default function EventDetailScreen({ route, navigation }) {
  // Obtenemos los datos del evento pasados desde EventsScreen
  const { event } = route.params;

  // 💡 USAMOS LOS DATOS REALES DE FIRESTORE PARA INICIALIZAR ESTADOS
  const [isAttending, setIsAttending] = useState(false);

  // Usamos el conteo real de Firestore, asegurando un valor por defecto
  const [attendeesCount, setAttendeesCount] = useState(event.stats?.attendees || 0);
  const [likesCount, setLikesCount] = useState(event.stats?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  // Lista simulada de asistentes (debería venir de un campo en Firestore)
  const [attendeesList, setAttendeesList] = useState([
    { id: 'u1', name: 'Juan Perez' },
    { id: 'u2', name: 'Maria Lopez' },
  ]);


  const handleToggleAttendance = () => {
    // 🚨 Aquí iría la llamada a updateEventStats('attendees', isAttending ? -1 : 1)
    setIsAttending(prev => !prev);
    // Simular actualización de conteo local
    setAttendeesCount(prev => prev + (isAttending ? -1 : 1));
  };

  const handleMapPress = () => {
    // Aquí iría la lógica para abrir Google Maps/Apple Maps
    console.log(`Abriendo mapa para la ubicación: ${event.address}`);
  };

  const handleLikePress = () => {
    // 🚨 Aquí iría la llamada a updateEventStats('likes', isLiked ? -1 : 1)
    setLikesCount(prev => prev + (isLiked ? -1 : 1));
    setIsLiked(prev => !prev);
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>


        <ImageBackground
          // 💡 Usar una URL por defecto si event.imageUrl no existe para evitar crash
          source={{ uri: event.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.imageHeader}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.background} />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.contentContainer}>

          <View style={styles.titleContainer}>
            <Text style={[styles.title, GLOBAL.text]}>{event.title}</Text>
            <TouchableOpacity style={styles.alertButton}>
              <Ionicons name="notifications-outline" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>


          <View style={styles.infoContainer}>
            <Ionicons name="pin" size={18} color={COLORS.textSecondary} />
            {/* 🎯 CORREGIDO: Usamos event.address del formulario */}
            <Text style={[styles.infoText, GLOBAL.textSecondary]}>{event.address}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Ionicons name="calendar" size={18} color={COLORS.textSecondary} />
            <Text style={[styles.infoText, GLOBAL.textSecondary]}>{event.date}</Text>
          </View>
          {/* 💡 AÑADIDO: Mostrar la hora */}
          <View style={styles.infoContainer}>
            <Ionicons name="time-outline" size={18} color={COLORS.textSecondary} />
            <Text style={[styles.infoText, GLOBAL.textSecondary]}>{event.time}</Text>
          </View>


          <Text style={[styles.sectionTitle, GLOBAL.text]}>Descripción</Text>
          <Text style={[styles.description, GLOBAL.text]}>
            {/* 🎯 CORREGIDO: Usamos la descripción real del evento */}
            {event.description}
          </Text>


          <View style={styles.interactionBar}>
            <View style={styles.iconCount}>
              <Ionicons name="people" size={20} color={COLORS.text} />
              {/* 💡 Usamos el conteo real que se inicializó con event.stats.attendees */}
              <Text style={[styles.countText, GLOBAL.text]}>{attendeesCount}</Text>
            </View>

            <TouchableOpacity onPress={handleLikePress} style={styles.iconCount}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={20}
                color={isLiked ? COLORS.accent : COLORS.text}
              />
              {/* 💡 Usamos el conteo real que se inicializó con event.stats.likes */}
              <Text style={[styles.countText, GLOBAL.text]}>{likesCount}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, isAttending && styles.cancelButton]}
            onPress={handleToggleAttendance}
          >
            <Text style={styles.actionButtonText}>
              {isAttending ? 'Cancelar asistencia' : 'Asistir'}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, styles.attendeesSection, GLOBAL.text]}>Asistentes ({attendeesList.length})</Text>
          <View style={styles.attendeesContainer}>
            {attendeesList.map(attendee => (
              <AttendeeItem key={attendee.id} name={attendee.name} />
            ))}
          </View>

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
    marginLeft: -5,
  },

  contentContainer: {
    padding: 16,
  },


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
    flexShrink: 1,
  },
  alertButton: {
    padding: 5,
  },


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


  attendeesSection: {
    marginTop: 10,
  },
  attendeesContainer: {

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