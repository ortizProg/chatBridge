import React, { useEffect, useState, useMemo } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import DiscussionItem from "../components/DiscussionItem";
import { GLOBAL, COLORS } from "../styles/styles";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

export default function HomeScreen({ navigation }) {
  const { posts, loading } = usePosts();
  const { user } = useAuth();
  const { expoPushToken, registerNotificationToken } = useNotification();
  const [activeTab, setActiveTab] = useState("popular"); 

  useEffect(() => {
    if(!user) return;
    console.log(user?.notificationPushToken != expoPushToken)
    if(!expoPushToken || user?.notificationPushToken != expoPushToken) {
      registerNotificationToken();
    }
  }, [user])

  const handleProfilePress = () => {
    if (user) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("Login");
    }
  };

  const sortedPosts = useMemo(() => {
    if (!posts || posts.length === 0) return [];

    const postsCopy = [...posts];

    if (activeTab === "popular") {
      return postsCopy.sort((a, b) => {
        const likesA = a.stats?.likes || 0;
        const likesB = b.stats?.likes || 0;
        return likesB - likesA;
      });
    } else {
      return postsCopy.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || a.createdAt || new Date(0);
        const dateB = b.createdAt?.toDate?.() || b.createdAt || new Date(0);
        return dateB - dateA;
      });
    }
  }, [posts, activeTab]);

  if (loading) {
    return (
      <View
        style={[
          GLOBAL.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[GLOBAL.text, { marginTop: 10 }]}>
          Cargando publicaciones...
        </Text>
      </View>
    );
  }

  return (
    <View style={GLOBAL.container}>
      <Header navigation={navigation} onProfilePress={handleProfilePress} />
      <SearchBar />

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "popular" && styles.tabActive]}
          onPress={() => setActiveTab("popular")}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, GLOBAL.text]}>
            Populares
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "recent" && styles.tabActive]}
          onPress={() => setActiveTab("recent")}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, GLOBAL.text]}>
            Recientes
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DiscussionItem item={item} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text
            style={[
              GLOBAL.textSecondary,
              { textAlign: "center", marginTop: 20 },
            ]}
          >
            No hay publicaciones aún
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.primary,
    fontSize: 16,
  },
});