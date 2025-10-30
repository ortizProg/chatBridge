import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Alert,
  Easing,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import { GLOBAL, COLORS } from "../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ChatsScreen() {
  const { posts, loading, deletePost } = usePosts();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [selectedPost, setSelectedPost] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState("post");

  const userPosts = posts.filter((p) => p.userId === user?.uid);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      handleCancelSelection();
    });
    return unsubscribe;
  }, [navigation]);

  const handleLongPress = (postId) => {
    setSelectedPost(postId);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCancelSelection = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setSelectedPost(null));
  };

  const handleDelete = (postId) => {
    Alert.alert("Eliminar publicación", "¿Seguro que deseas eliminar este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deletePost(postId);
          handleCancelSelection();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={[GLOBAL.textSecondary]}>Cargando tus publicaciones...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={handleCancelSelection}>
        <View style={styles.container}>
          <Text style={[styles.headerTitle, GLOBAL.text]}>Mis Publicaciones</Text>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "post" && styles.tabActive]}
              onPress={() => setActiveTab("post")}
            >
              <Text style={[styles.tabText, GLOBAL.text]}>Post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "evento" && styles.tabActive]}
              onPress={() => setActiveTab("evento")}
            >
              <Text style={[styles.tabText, GLOBAL.text]}>Evento</Text>
            </TouchableOpacity>
          </View>

          {activeTab === "post" ? (
            userPosts.length === 0 ? (
              <Text style={[GLOBAL.textSecondary, styles.emptyText]}>
                Aún no has publicado nada.
              </Text>
            ) : (
              <FlatList
                data={userPosts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                  <Animated.View
                    style={[
                      GLOBAL.card,
                      styles.postCard,
                      { transform: [{ scale: selectedPost === item.id ? scaleAnim : 1 }] },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onLongPress={() => handleLongPress(item.id)}
                    >
                      <View>
                        <Text style={[GLOBAL.text, styles.title]} numberOfLines={1}>
                          {item.title}
                        </Text>
                        {item.description ? (
                          <Text
                            style={[GLOBAL.textSecondary, styles.description]}
                            numberOfLines={2}
                          >
                            {item.description}
                          </Text>
                        ) : null}
                      </View>
                    </TouchableOpacity>

                    {selectedPost === item.id && (
                      <Animated.View
                        style={[styles.deleteButtonContainer, { opacity: fadeAnim }]}
                      >
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDelete(item.id)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={18} color="#fff" />
                          <Text style={styles.deleteText}>Eliminar</Text>
                        </TouchableOpacity>
                      </Animated.View>
                    )}
                  </Animated.View>
                )}
              />
            )
          ) : (
            <View style={styles.center}>
              <Text style={styles.soonText}>✨ Próximamente ✨</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  list: {
    paddingBottom: 100,
  },
  postCard: {
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: COLORS.text,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  deleteButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 5,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#e63946",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 3,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  soonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
  },
});
