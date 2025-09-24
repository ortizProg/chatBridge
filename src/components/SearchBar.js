import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLOBAL } from "../styles/styles";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
      <TextInput
        style={[styles.input, GLOBAL.text]}
        placeholder="Buscar discusion..."
        placeholderTextColor={COLORS.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontSize: 16,
  },
});
