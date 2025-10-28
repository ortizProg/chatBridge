import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLOBAL } from "../styles/styles";
import { useAuth } from "../contexts/authContext";

export default function TabBar({ state, navigation }) {

  const {user} = useAuth();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.tabButton}
      >
        <Ionicons
          name={state.index === 0 ? "home" : "home-outline"}
          size={28}
          color={state.index === 0 ? COLORS.primary : COLORS.textSecondary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Chats")}
        style={styles.tabButton}
      >
        <Ionicons
          name={state.index === 1 ? "chatbubble" : "chatbubble-ellipses-outline"}
          size={28}
          color={state.index === 1 ? COLORS.primary : COLORS.textSecondary}
        />
      </TouchableOpacity>

      {user ? 
      <TouchableOpacity
        onPress={() => navigation.navigate("AddPublication")}
        style={styles.tabButtonCenter}
      >
        <Ionicons name="add-circle" size={50} color={COLORS.accent} />
      </TouchableOpacity> : null}

      <TouchableOpacity
        onPress={() => navigation.navigate("Events")}
        style={styles.tabButton}
      >
        <Ionicons
          name={state.index === 3 ? "location" : "location-outline"}
          size={28}
          color={state.index === 3 ? COLORS.primary : COLORS.textSecondary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
        style={styles.tabButton}
      >
        <Ionicons
          name={state.index === 4 ? "settings" : "settings-outline"}
          size={28}
          color={state.index === 4 ? COLORS.primary : COLORS.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#333",
    paddingVertical: 10,
    backgroundColor: COLORS.background,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 5,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  tabButtonCenter: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -25,
  },
});
