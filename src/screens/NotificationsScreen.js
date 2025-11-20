import React, { useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { GLOBAL, COLORS } from "../styles/styles";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import NotificationItem from "../components/NotificationItem";

export default function NotificationsScreen({ navigation }) {
  const { user } = useAuth();
  const { expoPushToken, registerNotificationToken, loading, notifications } = useNotification();

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
          Cargando notificaciones...
        </Text>
      </View>
    );
  }

  return (
    <View style={GLOBAL.container}>
      <Header navigation={navigation} onProfilePress={handleProfilePress} />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text
            style={[
              GLOBAL.textSecondary,
              { textAlign: "center", marginTop: 20 },
            ]}
          >
            No hay notificaciones
          </Text>
        }
      />
    </View>
  );
}
