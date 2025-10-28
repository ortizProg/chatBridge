import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, GLOBAL } from "../styles/styles";

export default function DiscussionItem({ item }) {
  const navigation = useNavigation();

  const goToDetail = () => {
    navigation.navigate("DiscussionDetail", { item });
  };

  const handleLike = (e) => {
    e.stopPropagation(); 
    console.log("Like presionado para:", item.title);
  };

  const handleComment = (e) => {
    e.stopPropagation(); 
    console.log("Comentario presionado para:", item.title);
    goToDetail(); 
  };

  const handleView = (e) => {
    e.stopPropagation(); 
    console.log("Vistas presionado para:", item.title);
  };

  return (
    <TouchableOpacity
      style={[GLOBAL.card, styles.container]}
      activeOpacity={0.7}
      onPress={goToDetail}
    >
      <Image
        source={
          item.image
            ? item.image
            : require("../assets/images/Dayrito.png")
        }
        style={styles.avatar}
      />

      <View style={styles.content}>
        <Text style={[styles.title, GLOBAL.text]} numberOfLines={2}>
          {item.title}
        </Text>

        {item.description && (
          <Text style={[styles.description, GLOBAL.textSecondary]} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.stats}>
          <TouchableOpacity 
            style={styles.statItem}
            onPress={handleView}
            activeOpacity={0.6}
          >
            <Ionicons name="eye-outline" size={16} color={COLORS.accent} />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>
              {item.stats.views}
            </Text>
          </TouchableOpacity>


          <TouchableOpacity 
            style={styles.statItem}
            onPress={handleComment}
            activeOpacity={0.6}
          >
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.primary} />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>
              {item.stats.comments}
            </Text>
          </TouchableOpacity>


          <TouchableOpacity 
            style={styles.statItem}
            onPress={handleLike}
            activeOpacity={0.6}
          >
            <Ionicons name="flash-outline" size={16} color="#f5c518" />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>
              {item.stats.likes}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
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
    padding: 4,
  },
  stat: {
    fontSize: 13,
  },
});