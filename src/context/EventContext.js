import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  increment, 
  deleteDoc, 
  getDoc 
} from 'firebase/firestore';
import { db } from '../firebase'; // Asume que '../firebase' exporta la instancia 'db'
import { useAuth } from './AuthContext'; // Asume que './AuthContext' existe y proporciona 'useAuth'

const EventContext = createContext(undefined);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, authLoading } = useAuth();

  // --- 1. SUSCRIPCIÓN EN TIEMPO REAL ---
  useEffect(() => {
    // ⚠️ Esta consulta requiere un índice 'createdAt' en Firestore para funcionar correctamente.
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error('Error al cargar los eventos:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. CREACIÓN DE EVENTO ---
  const createEvent = async (title, description, address, date, time, maxCapacity) => {
    if (authLoading) {
      console.warn('Verificando sesión. Por favor espera...');
      return { success: false, message: 'Verificando sesión.' };
    }

    if (!user) {
      console.warn('Error: Debes iniciar sesión para crear un evento');
      return { success: false, message: 'Debes iniciar sesión para crear un evento.' };
    }

    try {
      // 1. Obtener datos de usuario para el nombre
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      
      const userName =
        userData?.userName?.trim() ||
        `${userData?.primer_nombre || ''} ${userData?.primer_apellido || ''}`.trim() ||
        user.email ||
        'Usuario anónimo';

      // 2. Parsear capacidad máxima
      const capacity = parseInt(maxCapacity, 10);
      const parsedMaxCapacity = isNaN(capacity) ? null : capacity;

      // 3. Agregar el documento a Firestore
      await addDoc(collection(db, 'events'), {
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        date: date.trim(), // Almacenamos la fecha como string por ahora
        time: time.trim(), // Almacenamos la hora como string por ahora
        maxCapacity: parsedMaxCapacity,
        userId: user.uid,
        userName,
        // Stats específicos de eventos
        stats: { attendees: 0, likes: 0, views: 0 }, 
        createdAt: new Date().toISOString(),
      });
      
      return { success: true, message: 'Evento creado correctamente.' };
    } catch (error) {
      console.error('Error al crear el evento:', error);
      return { success: false, message: 'No se pudo crear el evento. Inténtalo de nuevo.' };
    }
  };

  // --- 3. ACTUALIZACIÓN DE ESTADÍSTICAS (Ej: Asistencia/Likes) ---
  const updateEventStats = async (eventId, statType, value = 1) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        [`stats.${statType}`]: increment(value)
      });
    } catch (error) {
      console.error('Error al actualizar estadísticas del evento:', error);
      // No alertamos al usuario por errores de stats menores
    }
  };

  // --- 4. ELIMINACIÓN DE EVENTO ---
  const deleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      return { success: true, message: 'Evento eliminado.' };
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      return { success: false, message: 'No se pudo eliminar el evento.' };
    }
  };

  // --- 5. MEMOIZACIÓN Y EXPORTACIÓN DEL VALOR ---
  const value = useMemo(
    () => ({ events, loading, createEvent, updateEventStats, deleteEvent }),
    [events, loading, user, authLoading]
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents está siendo utilizado fuera del EventProvider');
  return ctx;
};