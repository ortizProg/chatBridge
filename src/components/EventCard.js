import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GLOBAL } from '../styles/styles';

export default function EventCard({ event, onPress, currentUserUid }) {

  const stats = event.stats || {};
  const attendeesCount = stats.attendees ?? 0;
  const likesCount = stats.likes ?? 0;


  const isLiked = event.likes ? event.likes.includes(currentUserUid) : false;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{
          uri:
            event.imageUrl ||
            "https://placehold.co/800x450/1C212C/E2E8F0?text=EVENTO",
        }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >

        <View style={styles.textOverlay}>
     
          <Text style={styles.cardTitle} numberOfLines={1}>
            {event.title}
          </Text>

     
          <View style={styles.mainInfo}>
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={COLORS.text}
                style={styles.iconShadow}
              />
              <Text style={styles.infoText}>
                {event.date} @ {event.time}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={COLORS.text}
                style={styles.iconShadow}
              />
              <Text style={styles.infoText} numberOfLines={1}>
                {event.address}
              </Text>
            </View>
          </View>

      
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Ionicons
                name="people-outline"
                size={18}
                color={COLORS.text}
                style={styles.iconShadow}
              />
              <Text style={styles.statText}>{attendeesCount} Asistentes</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={18}
                color={isLiked ? COLORS.accent : COLORS.text}
                style={styles.iconShadow}
              />
              <Text
                style={[
                  styles.statText,
                  isLiked && { color: COLORS.accent },
                ]}
              >
                {likesCount} Me gusta
              </Text>
            </View>
          </View>
        </View>

      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.background || "#121212",
    marginHorizontal: 0,
    marginVertical: 8,
    height: 250,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderRadius: 0,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 0,
  },
  textOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 15,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  mainInfo: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  iconShadow: {
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.text,
    marginLeft: 8,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  cardStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.4)",
    paddingTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  statText: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
