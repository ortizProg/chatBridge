import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLOBAL } from "../styles/styles";
import { useNavigation } from "@react-navigation/native";
import CommentItem from "../components/CommentItem";
import ReplyBar from "../components/ReplyBar";
import MessageInput from "../components/MessageInput";

export default function DiscussionDetailScreen({ route }) {
  const navigation = useNavigation();
  const { item } = route.params;
  const flatListRef = useRef(null);
  const headerOpacity = useRef(new Animated.Value(0)).current;

  const [userName] = useState("Tú");
  const [replyingTo, setReplyingTo] = useState(null);
  const [comments, setComments] = useState([
    { id: "1", text: "Hola, qué opinan de este tema?", author: "María" },
    { id: "2", text: "Interesante publicación 🔥", author: "Carlos" },
    { id: "3", text: "Me parece muy útil esta información", author: "Juan" },
  ]);

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSend = (message) => {
    if (message.trim()) {
      const newComment = {
        id: Date.now().toString(),
        text: message,
        author: userName,
        replyTo: replyingTo,
      };

      setComments((prev) => [...prev, newComment]);
      setReplyingTo(null);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={[GLOBAL.container, styles.mainContainer]}>
        <Animated.View
          style={[styles.headerContainer, { opacity: headerOpacity }]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={[GLOBAL.card, styles.postContainer]}>
            <View style={styles.header}>
              <Image
                source={
                  item.image
                    ? item.image
                    : require("../assets/images/Dayrito.png")
                }
                style={styles.avatar}
              />
              <View style={styles.headerContent}>
                <Text style={[styles.title, GLOBAL.text]}>{item.title}</Text>
                <Text style={[styles.description, GLOBAL.textSecondary]}>
                  {item.description}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <FlatList
          ref={flatListRef}
          data={comments}
          keyExtractor={(c) => c.id}
          renderItem={({ item: comment }) => (
            <CommentItem
              comment={comment}
              currentUser={userName}
              onReply={handleReply}
            />
          )}
          contentContainerStyle={styles.commentsList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

        {replyingTo && (
          <ReplyBar replyingTo={replyingTo} onCancel={handleCancelReply} />
        )}

        <MessageInput onSend={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 10,
    paddingBottom: 0,
  },
  headerContainer: {
    zIndex: 10,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 16,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 8,
    borderRadius: 20,
  },
  postContainer: {
    marginTop: 50,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2a2a2a",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentsList: {
    paddingBottom: 120,
    paddingTop: 8,
  },
});