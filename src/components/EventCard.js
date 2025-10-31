import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { COLORS, GLOBAL } from '../styles/styles'; 

const EventCard = ({ event, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
    <ImageBackground

      source={{ uri: event.imageUrl }} 
      style={styles.imageBackground}
      imageStyle={styles.imageStyle}

      resizeMode="cover"
    >
     
      <View style={styles.textOverlay}>
        <Text style={[styles.cardTitle, GLOBAL.text]} numberOfLines={1}>{event.title}</Text>
        <Text style={[styles.cardLocation, GLOBAL.text]}>{event.location}</Text>
        <Text style={[styles.cardDate, GLOBAL.text]}>{event.date}</Text>
        
        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={16} color={COLORS.textSecondary || '#aaa'} />
            <Text style={[styles.statText, GLOBAL.text]}>{event.attendees}</Text>
          </View>
          
   
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

  cardContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden', 
    height: 180, 
    backgroundColor: COLORS.surface || '#222', 
  },

  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end', 
  },
  imageStyle: {
    borderRadius: 8,
  },

  textOverlay: {
   
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary, 
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