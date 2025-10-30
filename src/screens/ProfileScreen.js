import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

import Header from "../components/Header";
import { GLOBAL, COLORS } from "../styles/styles";

import { doc, getDoc } from "firebase/firestore";

import { db } from '../firebase';
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          console.log("No se encontró el perfil del usuario");
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    };
    if (user?.uid) fetchProfile();
  }, [user?.uid]);

  return (
    <View style={[GLOBAL.container, styles.primaryContainer]}>
      <Header navigation={navigation} />

      <View style={styles.container}>
        <Image 
          source={require("../assets/images/profile.png")} 
          style={styles.image} 
          resizeMode="contain"
        />
        <Text style={styles.text} >
          @{profile?.userName}
        </Text>
        <View style={styles.stats}>
          
          <TouchableOpacity 
            style={styles.statItem}
            activeOpacity={0.6}
          >
            <Ionicons name="chatbubble-outline" size={25} color={COLORS.primary} />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>
              {profile?.commentsCount ?? 0}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statItem}
            activeOpacity={0.6}
          >
            <Ionicons name="flash-outline" size={25} color="#f5c518" />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>
              {profile?.flashsCount ?? 0}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statItem}
            activeOpacity={0.6}
          >
            <Ionicons name="location-outline" size={25} color={COLORS.accent} />
            <Text style={[styles.stat, GLOBAL.textSecondary]}>
              {profile?.eventsCount ?? 0}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
      

    </View>
  );

}

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 25,
    gap: 7
  },
  image: {
    width: 160,
    height: 160,
    objectFit: 'contain',
    borderRadius: 100,
  },
  text: {
    fontSize: 23,
    color: '#ffffff'
  },
  stats: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 4,
  },
  stat: {
    fontSize: 20,
  }
})