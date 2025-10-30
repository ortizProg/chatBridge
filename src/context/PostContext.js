import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
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
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const PostContext = createContext(undefined);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, authLoading } = useAuth();

  useEffect(() => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      Alert.alert('Error', 'No se pudieron cargar las publicaciones');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createPost = async (title, description) => {
    if (authLoading) {
      Alert.alert('Por favor espera', 'Estamos verificando tu sesión...');
      return false;
    }

    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para publicar');
      return false;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const userName =
        userData?.userName?.trim() ||
        `${userData?.primer_nombre || ''} ${userData?.primer_apellido || ''}`.trim() ||
        user.email ||
        'Usuario anónimo';

      await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        description: description.trim(),
        userId: user.uid,
        userName,
        stats: { likes: 0, comments: 0, views: 0 },
        createdAt: new Date().toISOString(),
      });
      
      Alert.alert('¡Éxito!', 'Publicación creada correctamente');
      return true;
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la publicación');
      return false;
    }
  };

  const updatePostStats = async (postId, statType) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        [`stats.${statType}`]: increment(1)
      });
    } catch (error) {
    }
  };

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      Alert.alert('Éxito', 'Publicación eliminada');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la publicación');
    }
  };

  const value = useMemo(
    () => ({ posts, loading, createPost, updatePostStats, deletePost }),
    [posts, loading, user, authLoading]
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePosts = () => {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error('usePosts está siendo utilizado fuera del PostProvider');
  return ctx;
};
