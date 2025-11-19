import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { COLORS } from "../styles/styles";

export default function CommentItem({ comment, currentUser, onReply }) {
  const displayAuthorName = comment.authorName && !comment.authorName.includes("@")
    ? comment.authorName
    : "Usuario";

  const displayReplyAuthorName = comment.replyTo?.authorName && !comment.replyTo.authorName.includes("@")
    ? comment.replyTo.authorName
    : "Usuario";

  const isCurrentUser = comment.authorId === currentUser?.uid;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        isCurrentUser ? styles.containerRight : styles.containerLeft,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateX: isCurrentUser
                ? slideAnim
                : slideAnim.interpolate({ inputRange: [0, 50], outputRange: [0, -50] }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onLongPress={() => onReply({ ...comment, authorName: displayAuthorName })}
        activeOpacity={0.7}
        style={{ width: "100%" }}
      >
        {!isCurrentUser && <Text style={styles.authorText}>{displayAuthorName}</Text>}

        <View style={[styles.bubble, isCurrentUser ? styles.bubbleRight : styles.bubbleLeft]}>
          {comment.replyTo && (
            <View style={styles.replyPreview}>
              <Text style={styles.replyAuthor}>Respondiendo a {displayReplyAuthorName}</Text>
              <Text style={styles.replyText} numberOfLines={2}>{comment.replyTo.text}</Text>
            </View>
          )}

          <Text style={styles.commentText}>{comment.text}</Text>
          <Text style={styles.timeText}>
            {comment.createdAt?.toDate
              ? comment.createdAt.toDate().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
              : new Date(comment.createdAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
            }
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: "column", 
    marginVertical: 6, 
    paddingHorizontal: 10, 
    maxWidth: "80%" 
  },
  containerLeft: { 
    alignSelf: "flex-start", 
    alignItems: "flex-start" 
  },
  containerRight: { 
    alignSelf: "flex-end", 
    alignItems: "flex-end" 
  },
  authorText: { 
    color: COLORS.textSecondary, 
    fontSize: 12, 
    marginLeft: 8, 
    marginBottom: 2, 
    fontWeight: "500" 
  },
  bubble: { 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 12, 
    borderWidth: 1.5 
  },
  bubbleLeft: { 
    backgroundColor: COLORS.bubbleLeft, 
    borderColor: COLORS.bubbleLeftBorder, 
    borderBottomLeftRadius: 4 
  },
  bubbleRight: { 
    backgroundColor: "#1a3a5f",
    borderColor: "#2d5a8f",
    borderBottomRightRadius: 4 
  },
  commentText: { 
    color: "#fff", 
    fontSize: 15, 
    lineHeight: 20, 
    marginBottom: 2 
  },
  timeText: { 
    color: "rgba(255,255,255,0.5)", 
    fontSize: 11, 
    alignSelf: "flex-end", 
    marginTop: 2 
  },
  replyPreview: { 
    borderLeftWidth: 3, 
    borderLeftColor: COLORS.primary, 
    paddingLeft: 8, 
    marginBottom: 6, 
    backgroundColor: "rgba(0,123,255,0.15)", 
    paddingVertical: 6, 
    paddingRight: 6, 
    borderRadius: 6 
  },
  replyAuthor: { 
    color: COLORS.primary, 
    fontSize: 12, 
    fontWeight: "600", 
    marginBottom: 2 
  },
  replyText: { 
    color: "rgba(255,255,255,0.8)", 
    fontSize: 13 
  },
});