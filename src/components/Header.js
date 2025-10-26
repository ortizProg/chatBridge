import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, GLOBAL } from "../styles/styles";
import { useAuth } from "../contexts/authContext";

export default function Header({ navigation }) {

  const {user} = useAuth();
  console.log("🚀 ~ Header ~ user:", user)

  const onPressProfile= () => {

    if (user) {
      return navigation.navigate('Profile')
    }
    navigation.navigate('Login')
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require("../assets/images/Logo.png")} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={[styles.title, GLOBAL.text]}>ChatBridge</Text>
      </View>
      <View style={styles.icons}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profile} onPress={onPressProfile}>
          <Ionicons name="person-circle-outline" size={28} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 36,
    height: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  icons: {
    flexDirection: "row",
    gap: 12,
  },
  profile: {
    marginLeft: 8,
  },
});
