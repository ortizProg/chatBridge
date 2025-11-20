import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, GLOBAL } from "../styles/styles";
import { usePosts } from "../context/PostContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';

export default function DiscussionItem({ item }) {
  const navigation = useNavigation();
  const { updatePostStats } = usePosts();
  const [liked, setLiked] = useState(item.userHasLiked || false);
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const fetchUserImage = async () => {
      if (!item.userId) return;
      
      try {
        const userDocRef = doc(db, 'users', item.userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserImage(userData.img || null);
        }
      } catch (error) {
        console.error("Error al obtener imagen del usuario:", error);
      }
    };

    fetchUserImage();
  }, [item.userId]);

  useEffect(() => {
    setLiked(item.userHasLiked || false);
  }, [item.userHasLiked, item.id]);

  const goToDetail = () => {
    navigation.navigate("DiscussionDetail", { item });
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    const newState = !liked;
    setLiked(newState);
    await updatePostStats(item.id, "likes");
  };

  const handleComment = (e) => {
    e.stopPropagation();
    goToDetail();
  };

  const handleView = (e) => {
    e.stopPropagation();
    updatePostStats(item.id, "views");
  };

  const getInitials = (userName) => {
    if (!userName) return "U";
    const names = userName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  return (
    <TouchableOpacity
      style={[GLOBAL.card, styles.container]}
      activeOpacity={0.7}
      onPress={goToDetail}
    >
      {userImage ? (
        <Image
          source={{ uri: userImage }}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {getInitials(item.userName)}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={[styles.author, GLOBAL.textSecondary]} numberOfLines={1}>
          {item.userName || "Usuario"}
        </Text>

        <Text style={[styles.title, GLOBAL.text]} numberOfLines={2}>
          {item.title}
        </Text>

        {item.description && (
          <Text
            style={[styles.description, GLOBAL.textSecondary]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}

        <View style={styles.stats}>
          <TouchableOpacity style={styles.statItem} onPress={handleView}>
            <Ionicons name="eye-outline" size={16} color={COLORS.accent} />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>
              {item.stats?.views || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statItem} onPress={handleComment}>
            <Ionicons
              name="chatbubble-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>
              {item.stats?.comments || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statItem}
            onPress={handleLike}
            activeOpacity={0.7}
          >
            <Ionicons
              name={liked ? "flash" : "flash-outline"}
              size={18}
              color={liked ? "#ffd60a" : "#f5c518"}
            />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>
              {item.stats?.likes || 0}
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
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a5568',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  author: {
    fontSize: 12,
    marginBottom: 2,
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