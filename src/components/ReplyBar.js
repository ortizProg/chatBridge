import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../styles/styles";

export default function ReplyBar({ replyingTo, onCancel }) {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 80,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCancel = () => {
    Animated.timing(slideAnim, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onCancel();
    });
  };

  const displayAuthorName = replyingTo.authorName && !replyingTo.authorName.includes("@")
    ? replyingTo.authorName
    : "Usuario";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="return-down-forward" size={20} color={COLORS.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.replyingTo}>
          Respondiendo a {displayAuthorName}
        </Text>
        <Text style={styles.replyingText} numberOfLines={1}>
          {replyingTo.text}
        </Text>
      </View>

      <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
        <Ionicons name="close-circle" size={24} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 12,
    position: "absolute",
    bottom: 70,
    left: 16,
    right: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2d5a8f",
  },
  iconContainer: {
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  replyingTo: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  replyingText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  closeButton: {
    padding: 4,
  },
});