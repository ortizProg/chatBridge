import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
// Importamos tus estilos
import { COLORS, GLOBAL } from '../styles/styles'; 

const EventCard = ({ event, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
    <ImageBackground
      source={{ uri: event.imageUrl || 'https://placehold.co/800x450/1C212C/E2E8F0?text=EVENTO+SIN+FOTO' }}
      style={styles.imageBackground}
      imageStyle={styles.imageStyle}
      resizeMode="cover"
    >
      {/* CAPA DE TEXTO CON GRADIENTE OSCURO EN EL FONDO */}
      <View style={styles.textOverlay}>
        
        {/* TÍTULO */}
        <Text style={styles.cardTitle} numberOfLines={1}>{event.title}</Text>
        
        {/* INFORMACIÓN PRINCIPAL (FECHA, HORA, UBICACIÓN) */}
        <View style={styles.mainInfo}>
            {/* FECHA Y HORA */}
            <View style={styles.infoRow}>
                {/* Íconos en blanco (COLORS.text) */}
                <Ionicons name="calendar-outline" size={14} color={COLORS.text} /> 
                <Text style={styles.infoText}>{event.date} @ {event.time}</Text>
            </View>
            
            {/* UBICACIÓN */}
            <View style={styles.infoRow}>
                {/* Íconos en blanco (COLORS.text) */}
                <Ionicons name="location-outline" size={14} color={COLORS.text} />
                <Text style={styles.infoText} numberOfLines={1}>{event.address}</Text>
            </View>
        </View>

        {/* ESTADÍSTICAS */}
        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            {/* Íconos en blanco (COLORS.text) */}
            <Ionicons name="people-outline" size={16} color={COLORS.text} /> 
            <Text style={styles.statText}>{event.stats?.attendees || 0} Asistentes</Text>
          </View>
          <View style={styles.statItem}>
            {/* Íconos en blanco (COLORS.text) */}
            <Ionicons name="heart-outline" size={16} color={COLORS.text} />
            <Text style={styles.statText}>{event.stats?.likes || 0} Me gusta</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cardContainer: {
    // Usamos 'background' o un color oscuro si 'surface' no está definido
    backgroundColor: COLORS.background || '#121212', 
    
    // --- INICIO DE CORRECCIÓN DE MARGENES ---
    // Neutraliza el paddingHorizontal: 16 del contenedor padre (GLOBAL.container)
    marginHorizontal: -16, 
    // Mantenemos solo el borde inferior redondeado ya que la tarjeta toca el borde superior de la pantalla.
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    // --- FIN DE CORRECCIÓN DE MARGENES ---
    
    marginVertical: 10,
    overflow: 'hidden',
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  imageBackground: {
    width: '100%',
    height: 220, 
    justifyContent: 'flex-end',
  },
  imageStyle: {
    // Eliminar los border radius superiores aquí también, o solo en el cardContainer.
    borderTopLeftRadius: 0, 
    borderTopRightRadius: 0,
  },
  textOverlay: {
    // Fondo semi-transparente para asegurar legibilidad
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    // Usamos el padding de 16 de vuelta para el contenido de texto interno
    padding: 15, 
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text, // Relleno BLANCO usando tu constante COLORS.text
    marginBottom: 10,
    // Borde oscuro simulado (stroke) para el título
    textShadowColor: 'rgba(0, 0, 0, 1)', 
    textShadowOffset: { width: 0, height: 0 }, 
    textShadowRadius: 4, 
  },
  mainInfo: {
      marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, 
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text, // Relleno BLANCO usando tu constante COLORS.text
    marginLeft: 8,
    fontWeight: '600',
    flexShrink: 1, 
    // Borde oscuro simulado para el texto informativo
    textShadowColor: 'rgba(0, 0, 0, 1)', 
    textShadowOffset: { width: 0, height: 0 }, 
    textShadowRadius: 4, 
  },
  cardStats: {
    flexDirection: 'row',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)', 
    paddingTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text, // Relleno BLANCO usando tu constante COLORS.text
    // Borde oscuro simulado para las estadísticas
    textShadowColor: 'rgba(0, 0, 0, 1)', 
    textShadowOffset: { width: 0, height: 0 }, 
    textShadowRadius: 4, 
  },
});

export default EventCard;