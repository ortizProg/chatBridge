import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { COLORS, GLOBAL } from '../styles/styles'; 

const EventCard = ({ event, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
    <ImageBackground
      // 🚨 Usamos la propiedad 'imageUrl' del objeto 'event'
      // Si la URL no existe, puedes usar una imagen local como fallback
      source={{ uri: event.imageUrl }} 
      style={styles.imageBackground}
      imageStyle={styles.imageStyle}
      // Opcionalmente, puedes añadir un fondo oscuro para cuando la imagen esté cargando
      resizeMode="cover"
    >
      {/* Contenedor para el texto superpuesto, alineado abajo */}
      <View style={styles.textOverlay}>
        <Text style={[styles.cardTitle, GLOBAL.text]} numberOfLines={1}>{event.title}</Text>
        <Text style={[styles.cardLocation, GLOBAL.text]}>{event.location}</Text>
        <Text style={[styles.cardDate, GLOBAL.text]}>{event.date}</Text>
        
        <View style={styles.cardStats}>
          {/* Ícono de Asistentes */}
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={16} color={COLORS.textSecondary || '#aaa'} />
            <Text style={[styles.statText, GLOBAL.text]}>{event.attendees}</Text>
          </View>
          
          {/* Ícono de Rayito (Likes) */}
          <View style={styles.statItem}>
            <Ionicons name="flash-outline" size={16} color="#f5c518" />
            <Text style={[styles.statText, GLOBAL.text]}>{event.likes}</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // Contenedor principal que define la forma de la tarjeta
  cardContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden', // Necesario para que la imagen de fondo respete el border radius
    height: 180, // Altura fija para la tarjeta (puedes ajustarla)
    backgroundColor: COLORS.surface || '#222', 
  },
  // Estilo para ImageBackground que toma el 100% del contenedor
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end', // Alinea el contenido (textOverlay) a la parte inferior
  },
  imageStyle: {
    borderRadius: 8,
  },
  // Contenedor con fondo semi-transparente para el texto
  textOverlay: {
    // Fondo oscuro semi-transparente para asegurar la legibilidad del texto blanco
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary, // Texto principal (ej: blanco)
  },
  cardLocation: {
    fontSize: 14,
    color: COLORS.textSecondary || '#aaa',
    marginTop: 4,
  },
  cardDate: {
    fontSize: 14,
    color: COLORS.textSecondary || '#aaa',
    marginTop: 4,
  },
  cardStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    color: COLORS.textSecondary || '#aaa',
    marginLeft: 4,
    fontSize: 13,
  },
});

export default EventCard;