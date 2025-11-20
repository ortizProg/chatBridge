import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  deleteDoc,
  getDoc,
  query
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from './AuthContext';

const EventContext = createContext(undefined);


const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError("No se pudo convertir la URI en Blob."));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};


const uploadImage = async (uri, userId) => {
  if (!uri) return null;
  try {
    const blob = await uriToBlob(uri);
    const filename = `${Date.now()}_${userId}.jpg`;
    const storageRef = ref(storage, `events/${userId}/${filename}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();


  useEffect(() => {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef);

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        data.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

        setEvents(data);
        setLoading(false);
      },
      err => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);


  const createEvent = async (title, description, address, date, time, maxCapacity, imageUri) => {
    if (!user) return { success: false, message: 'Debes iniciar sesión.' };

    try {
      const imageUrl = await uploadImage(imageUri, user.uid);

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      const userName = userData?.name || user.email.split('@')[0];

      await addDoc(collection(db, 'events'), {
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        date,
        time,
        maxCapacity: maxCapacity ? Number(maxCapacity) : null,
        userId: user.uid,
        userName,
        imageUrl,
        attendees: [],
        stats: { attendees: 0, likes: 0, views: 0 },
        createdAt: new Date().toISOString(),
      });

      return { success: true, message: 'Evento creado correctamente.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };


  const toggleAttendance = async (eventId, uid) => {
    const eventRef = doc(db, "events", eventId);
    const snap = await getDoc(eventRef);

    if (!snap.exists()) return false;

    const data = snap.data();
    const list = data.attendees || [];

    const isAttending = list.includes(uid);

    const newList = isAttending
      ? list.filter(i => i !== uid)
      : [...list, uid];

    await updateDoc(eventRef, {
      attendees: newList,
      "stats.attendees": increment(isAttending ? -1 : 1)
    });

    return !isAttending;
  };


  const toggleLike = async (eventId, isLiked) => {
    const eventRef = doc(db, "events", eventId);

    await updateDoc(eventRef, {
      "stats.likes": increment(isLiked ? -1 : 1)
    });

    return !isLiked;
  };

  
  const deleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (e) { console.error(e); }
  };

  return (
    <EventContext.Provider value={{
      events,
      loading,
      createEvent,
      toggleAttendance,
      toggleLike,
      deleteEvent
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvents debe usarse dentro de EventProvider");
  return ctx;
};
