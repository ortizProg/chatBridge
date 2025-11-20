import { View, Image, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import Header from "../components/Header";
import { GLOBAL, COLORS } from "../styles/styles";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {

  const { user, saveImage } = useAuth();

  const [profile, setProfile] = useState(null);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [stats, setStats] = useState({
    commentsCount: 0,
    flashsCount: 0,
    eventsCount: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setSelectedImageUri(null);
    setProfile(null);
    setStats({
      commentsCount: 0,
      flashsCount: 0,
      eventsCount: 0
    });
    setLoadingStats(true);
  }, [user?.uid]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };
    if (user?.uid) fetchProfile();
  }, [user?.uid]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.uid) return;
      
      setLoadingStats(true);
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        let totalLikes = 0;
        let totalComments = 0;
        let totalViews = 0;

        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          totalLikes += postData.stats?.likes || 0;
          totalComments += postData.stats?.comments || 0;
          totalViews += postData.stats?.views || 0;
        });

        setStats({
          commentsCount: totalComments,
          flashsCount: totalLikes,
          eventsCount: totalViews
        });
      } catch (error) {
        console.error("Error al calcular estadísticas:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUserStats();
  }, [user?.uid]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos permiso para acceder a la galería.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
      saveImage(result.assets[0].uri)
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

  const imageSource = selectedImageUri 
    ? { uri: selectedImageUri } 
    : profile?.img 
      ? { uri: profile.img } 
      : null;

  return (
    <View style={[GLOBAL.container, styles.primaryContainer]}>
      <Header navigation={navigation} />

      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage}>
          {imageSource ? (
            <Image 
              source={imageSource} 
              style={styles.image} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(profile?.userName || user?.displayName)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.text}>
          @{profile?.userName}
        </Text>
        
        <View style={styles.stats}>
          <TouchableOpacity 
            style={styles.statItem}
            activeOpacity={0.6}
          >
            <Ionicons name="chatbubble-outline" size={25} color={COLORS.primary} />
            {loadingStats ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={[styles.stat, GLOBAL.textSecondary]}>
                {stats.commentsCount}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statItem}
            activeOpacity={0.6}
          >
            <Ionicons name="flash-outline" size={25} color="#f5c518" />
            {loadingStats ? (
              <ActivityIndicator size="small" color="#f5c518" />
            ) : (
              <Text style={[styles.stat, GLOBAL.textSecondary]}>
                {stats.flashsCount}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statItem}
            activeOpacity={0.6}
          >
            <Ionicons name="eye-outline" size={25} color={COLORS.accent} />
            {loadingStats ? (
              <ActivityIndicator size="small" color={COLORS.accent} />
            ) : (
              <Text style={[styles.stat, GLOBAL.textSecondary]}>
                {stats.eventsCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 25,
    gap: 7
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  avatarPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#4a5568',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#ffffff',
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
    minWidth: 60,
  },
  stat: {
    fontSize: 20,
  }
});