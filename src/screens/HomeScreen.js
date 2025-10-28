import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import DiscussionItem from "../components/DiscussionItem";
import { GLOBAL, COLORS } from "../styles/styles";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { posts, loading } = usePosts();
  const { user } = useAuth();

  const handleProfilePress = () => {
    if (user) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("Login");
    }
  };

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

      <View style={GLOBAL.tabs}>
        <Text style={GLOBAL.tabActive}>Populares</Text>
        <Text style={GLOBAL.tab}>Recientes</Text>
      </View>

      <FlatList
        data={posts}
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
