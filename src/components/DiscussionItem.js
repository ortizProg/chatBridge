import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLOBAL } from "../styles/styles";

export default function DiscussionItem({ item }) {
  return (
    <View style={[GLOBAL.card, styles.container]}>
      <Image
        source={
          item.image
            ? item.image
            : require("../assets/images/Dayrito.png")
        }
        style={styles.avatar}
      />

      <View style={styles.content}>
        <Text style={[styles.title, GLOBAL.text]}>{item.title}</Text>

        <View style={styles.stats}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={''}
          >
            <Ionicons name="eye-outline" size={16} color={COLORS.accent} />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>{item.stats.views}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statItem}
            onPress={''}
          >
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.primary} />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>{item.stats.comments}</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.statItem}
            onPress={''}
          >
            <Ionicons name="flash-outline" size={16} color="#f5c518" />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>{item.stats.likes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2a2a2a",
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stat: {
    fontSize: 13,
  },
});
