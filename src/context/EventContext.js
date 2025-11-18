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
  query // Nota: Quitamos orderBy de aquí para evitar el bloqueo
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from './AuthContext';

const EventContext = createContext(undefined);

// Función para convertir URI a Blob
const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.error("Fallo la solicitud XHR para la URI:", e);
      reject(new TypeError("Fallo la conversión de URI a Blob."));
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
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw new Error(error.message);
  }
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, authLoading } = useAuth();

  // --- SUSCRIPCIÓN EN TIEMPO REAL ---
  useEffect(() => {
    // 1. Referencia básica a la colección
    const eventsRef = collection(db, 'events');
    
    // 2. Creamos la query SIN orderBy para evitar problemas de índices faltantes
    const q = query(eventsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 3. Ordenamos en el cliente (JavaScript) por fecha de creación descendente
      // Asumiendo que createdAt es un string ISO o timestamp
      eventsData.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
            return b.createdAt.localeCompare(a.createdAt);
        }
        return 0;
      });

      setEvents(eventsData);
      setLoading(false); // <--- ESTO DESBLOQUEA LA PANTALLA DE CARGA
    }, (error) => {
      console.error("Error en onSnapshot:", error);
      setLoading(false); // Importante: dejar de cargar incluso si hay error
    });

    return () => unsubscribe();
  }, []);

  // --- CREACIÓN DE EVENTO ---
  const createEvent = async (title, description, address, date, time, maxCapacity, imageUri) => {
    if (authLoading) return { success: false, message: 'Verificando sesión.' };
    if (!user) return { success: false, message: 'Debes iniciar sesión.' };
    if (!imageUri) return { success: false, message: 'Se requiere imagen.' };

    try {
      const imageUrl = await uploadImage(imageUri, user.uid);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const userName = userData?.userName?.trim() || user.email || 'Anónimo';
      
      const capacity = parseInt(maxCapacity, 10);
      const parsedMaxCapacity = isNaN(capacity) ? null : capacity;

      await addDoc(collection(db, 'events'), {
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        date: date.trim(),
        time: time.trim(),
        maxCapacity: parsedMaxCapacity,
        userId: user.uid,
        userName,
        imageUrl: imageUrl,
        stats: { attendees: 0, likes: 0, views: 0 },
        createdAt: new Date().toISOString(),
      });

      return { success: true, message: 'Evento creado correctamente.' };
    } catch (error) {
      console.error('Error al crear evento:', error);
      return { success: false, message: error.message };
    }
  };

  // --- OTRAS FUNCIONES ---
  const updateEventStats = async (eventId, statType, value = 1) => {
    try {
        const eventRef = doc(db, 'events', eventId);
        await updateDoc(eventRef, { [`stats.${statType}`]: increment(value) });
    } catch (e) { console.error(e); }
  };

  const deleteEvent = async (eventId) => {
      try { await deleteDoc(doc(db, 'events', eventId)); } catch(e) { console.error(e); }
  };

  const value = useMemo(() => ({
    events, loading, createEvent, updateEventStats, deleteEvent
  }), [events, loading, user, authLoading]);

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents fuera de EventProvider');
  return ctx;
};