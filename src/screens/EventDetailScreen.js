import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GLOBAL } from '../styles/styles';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";



const AttendeeItem = ({ name }) => {
  const displayName =
    name?.includes('@') ? name.split('@')[0] : name || "Invitado";

  return (
    <View style={styles.attendeeItem}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{displayName[0]?.toUpperCase()}</Text>
      </View>
      <Text style={[styles.attendeeName, GLOBAL.text]}>{displayName}</Text>
    </View>
  );
};


export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params;
  const { toggleAttendance, toggleLike } = useEvents();
  const { user } = useAuth();

  const [attendeesList, setAttendeesList] = useState(event.attendees || []);
  const [attendeesNames, setAttendeesNames] = useState([]);

  const [isAttending, setIsAttending] = useState(false);
  const [likesCount, setLikesCount] = useState(event.stats?.likes || 0);
  const [attendeesCount, setAttendeesCount] = useState(event.stats?.attendees || 0);
  const [isLiked, setIsLiked] = useState(false);



  const resolveUserName = async (uid) => {
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

     
        if (data.userName) return data.userName;


        if (data.name) return data.name;
      }

  
      if (uid.includes("@")) return uid.split("@")[0];

 
      return uid;

    } catch (error) {
      return uid;
    }
  };



  useEffect(() => {
    if (user && attendeesList.includes(user.uid)) {
      setIsAttending(true);
    }
  }, [event, user]);


  useEffect(() => {
    const loadNames = async () => {
      const names = [];
      for (const uid of attendeesList) {
        names.push(await resolveUserName(uid));
      }
      setAttendeesNames(names);
    };

    loadNames();
  }, [attendeesList]);


  const handleToggleAttendance = async () => {
    if (!user) return;

    const newState = await toggleAttendance(event.id, user.uid);

    setIsAttending(newState);

    if (newState) {
      setAttendeesList(prev => [...prev, user.uid]);
      setAttendeesCount(prev => prev + 1);
    } else {
      setAttendeesList(prev => prev.filter(id => id !== user.uid));
      setAttendeesCount(prev => prev - 1);
    }
  };



  const handleLikePress = async () => {
    if (!user) return;
    const newState = await toggleLike(event.id, isLiked);
    setIsLiked(newState);
    setLikesCount(prev => prev + (newState ? 1 : -1));
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

  
        <ImageBackground
          source={{ uri: event.imageUrl }}
          style={styles.imageHeader}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.background} />
          </TouchableOpacity>
        </ImageBackground>

      
        <View style={styles.contentContainer}>


          <View style={styles.titleContainer}>
            <Text style={[styles.title, GLOBAL.text]}>{event.title}</Text>
            <TouchableOpacity style={styles.alertButton}>
              <Ionicons name="notifications-outline" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Ionicons name="pin" size={18} color={COLORS.textSecondary} />
            <Text style={[styles.infoText, GLOBAL.textSecondary]}>{event.address}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Ionicons name="calendar" size={18} color={COLORS.textSecondary} />
            <Text style={[styles.infoText, GLOBAL.textSecondary]}>{event.date}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Ionicons name="time-outline" size={18} color={COLORS.textSecondary} />
            <Text style={[styles.infoText, GLOBAL.textSecondary]}>{event.time}</Text>
          </View>


          <Text style={[styles.sectionTitle, GLOBAL.text]}>Descripción</Text>
          <Text style={[styles.description, GLOBAL.text]}>{event.description}</Text>

          <View style={styles.interactionBar}>
            <View style={styles.iconCount}>
              <Ionicons name="people" size={20} color={COLORS.text} />
              <Text style={[styles.countText, GLOBAL.text]}>{attendeesCount}</Text>
            </View>

            <TouchableOpacity onPress={handleLikePress} style={styles.iconCount}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={20}
                color={isLiked ? COLORS.accent : COLORS.text}
              />
              <Text style={[styles.countText, GLOBAL.text]}>{likesCount}</Text>
            </TouchableOpacity>
          </View>


          <TouchableOpacity
            style={[styles.actionButton, isAttending && styles.cancelButton]}
            onPress={handleToggleAttendance}
          >
            <Text style={styles.actionButtonText}>
              {isAttending ? 'Cancelar asistencia' : 'Asistir'}
            </Text>
          </TouchableOpacity>


          <Text style={[styles.sectionTitle, styles.attendeesSection, GLOBAL.text]}>
            Asistentes ({attendeesNames.length})
          </Text>

          <View style={styles.attendeesContainer}>
            {attendeesNames.map((name, index) => (
              <AttendeeItem key={index} name={name} />
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}





const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },

  imageHeader: {
    width: "100%",
    height: 250
  },

  backButton: {
  position: 'absolute',
  top: 25,
  left: 20,
  backgroundColor: "rgba(197, 188, 188, 0.5)",
  width: 55,
  height: 55,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 35,
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 4
},


  contentContainer: { padding: 16 },

  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  title: { fontSize: 28, fontWeight: "bold", color: COLORS.primary },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5
  },

  infoText: { marginLeft: 8, fontSize: 16 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10
  },

  description: { fontSize: 16, lineHeight: 24, marginBottom: 20 },

  interactionBar: {
    flexDirection: "row",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.surface,
    marginBottom: 20
  },

  iconCount: { flexDirection: "row", alignItems: "center", marginRight: 25 },
  countText: { fontSize: 16, marginLeft: 6 },

  actionButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15
  },

  cancelButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent
  },

  actionButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.background
  },

  attendeesSection: { marginTop: 10 },

  attendeeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },

  avatarPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.textSecondary,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },

  avatarText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 18
  },

  attendeeName: {
    fontSize: 16,
    color: COLORS.text
  }
});
