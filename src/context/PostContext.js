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
  getDoc, 
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const PostContext = createContext(undefined);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, authLoading } = useAuth();

  useEffect(() => {
    console.log('PostContext: Usuario cambió:', user?.uid || 'No hay usuario');
    
    setPosts([]);
    setLoading(true);

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, async (snapshot) => {
      console.log('PostContext: Snapshot recibido, posts:', snapshot.docs.length);
      
      const postsData = await Promise.all(
        snapshot.docs.map(async (postDoc) => {
          const post = { id: postDoc.id, ...postDoc.data() };

          if (user?.uid) {
            try {
              const likeDoc = await getDoc(doc(db, "posts", post.id, "likes", user.uid));
              post.userHasLiked = likeDoc.exists();
              console.log(`Post ${post.id}: userHasLiked = ${post.userHasLiked} para user ${user.uid}`);
            } catch (error) {
              console.error("Error checking like status:", error);
              post.userHasLiked = false;
            }
          } else {
            post.userHasLiked = false;
          }

          return post;
        })
      );

      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error('Error en snapshot listener:', error);
      setLoading(false);
    });

    return () => {
      console.log('PostContext: Limpiando listener');
      unsub();
    };
  }, [user?.uid]); 

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
        'Usuario';

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
      console.error("Error creating post:", error);
      Alert.alert('Error', 'No se pudo crear la publicación');
      return false;
    }
  };

  const updatePostStats = async (postId, statType) => {
    if (!user?.uid) {
      Alert.alert("Error", "Debes iniciar sesión");
      return;
    }

    console.log(`updatePostStats: ${statType} en post ${postId} por usuario ${user.uid}`);

    try {
      const postRef = doc(db, "posts", postId);

      if (statType === "likes") {
        const likeRef = doc(db, "posts", postId, "likes", user.uid);
        const likeDoc = await getDoc(likeRef);

        console.log(`Like existe antes de actualizar: ${likeDoc.exists()}`);

        if (likeDoc.exists()) {
          await deleteDoc(likeRef);
          await updateDoc(postRef, { "stats.likes": increment(-1) });
          console.log('Like removido');
        } else {
          await setDoc(likeRef, { 
            userId: user.uid,
            createdAt: new Date().toISOString()
          });
          await updateDoc(postRef, { "stats.likes": increment(1) });
          console.log('Like agregado');
        }

        return;
      }

      await updateDoc(postRef, {
        [`stats.${statType}`]: increment(1),
      });
    } catch (error) {
      console.error(`Error updating ${statType}:`, error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      Alert.alert('Éxito', 'Publicación eliminada');
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert('Error', 'No se pudo eliminar la publicación');
    }
  };

  const value = useMemo(
    () => ({ posts, loading, createPost, updatePostStats, deletePost }),
    [posts, loading, user?.uid, authLoading]
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePosts = () => {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error('usePosts debe usarse dentro de PostProvider');
  return ctx;
};