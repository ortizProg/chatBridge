import React, { useRef, useEffect, useState } from "react";
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
import { useAuth } from "../context/AuthContext";
import { useComments } from "../hooks/useComments";
import { useNotification } from "../context/NotificationContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';

export default function DiscussionDetailScreen({ route }) {
  const navigation = useNavigation();
  const { item } = route?.params || {};
  const flatListRef = useRef(null);
  const headerOpacity = useRef(new Animated.Value(0)).current;

  const { user } = useAuth();
  const { createNotification } = useNotification();

  const currentUser = { uid: user?.uid, userName: user?.userName || user?.displayName || "Usuario" };

  const { comments, loadingComments, addComment } = useComments(item.id, currentUser);

  const [replyingTo, setReplyingTo] = useState(null);
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
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSend = async (message) => {
    if (!user) return navigation.navigate("Login");
    const res = await addComment(message, replyingTo ? {
      id: replyingTo.id,
      authorId: replyingTo.authorId,
      authorName: replyingTo.authorName,
      text: replyingTo.text,
    } : null);
    if (res.success) {
      setReplyingTo(null);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);

      const data = {
        title: 'Publicación',
        body: `Alguien ha comentado tu publicación "${item.title}"`
      }

      if(item.userId != user.uid) {
        createNotification(item.userId, data);
      }

    } else {
      console.log("Error al agregar comentario", res.error);
    }
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={[GLOBAL.container, styles.mainContainer]}>
        <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={[GLOBAL.card, styles.postContainer]}>
            <View style={styles.header}>
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
              <View style={styles.headerContent}>
                <Text style={[styles.title, GLOBAL.text]}>{item.title}</Text>
                <Text style={[styles.description, GLOBAL.textSecondary]}>{item.description}</Text>
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
              currentUser={currentUser}
              onReply={(c) => setReplyingTo(c)}
            />
          )}
          contentContainerStyle={styles.commentsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={{ padding: 20 }}>
              <Text style={GLOBAL.textSecondary}>Sé el primero en comentar.</Text>
            </View>
          )}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {replyingTo && (
          <ReplyBar replyingTo={replyingTo} onCancel={() => setReplyingTo(null)} />
        )}

        <MessageInput 
          onSend={handleSend}
          onSendComplete={() => setReplyingTo(null)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    paddingTop: 10, 
    paddingBottom: 0 
  },
  headerContainer: { 
    zIndex: 10 
  },
  backButton: { 
    position: "absolute", 
    top: 10, 
    left: 16, 
    zIndex: 20, 
    backgroundColor: "rgba(0,0,0,0.7)", 
    padding: 8, 
    borderRadius: 20 
  },
  postContainer: { 
    marginTop: 50, 
    marginBottom: 16 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "flex-start", 
    gap: 12 
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: "#2a2a2a" 
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
  headerContent: { 
    flex: 1 
  },
  title: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 4 
  },
  description: { 
    fontSize: 14, 
    lineHeight: 20 
  },
  commentsList: { 
    paddingBottom: 120, 
    paddingTop: 8 
  },
});