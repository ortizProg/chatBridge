import { useEffect, useState, useCallback } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  doc,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export function useComments(postId, currentUser) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(
      q,
      async (snap) => {
        const arr = await Promise.all(
          snap.docs.map(async (d) => {
            const commentData = { id: d.id, ...d.data() };
            
            if (commentData.authorName && commentData.authorName.includes('@')) {
              try {
                const userDoc = await getDoc(doc(db, 'users', commentData.authorId));
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  commentData.authorName = userData.userName || 
                    `${userData.primer_nombre || ''} ${userData.primer_apellido || ''}`.trim() || 
                    'Usuario';
                }
              } catch (err) {
                console.error('Error al obtener datos del usuario:', err);
              }
            }
            
            if (commentData.replyTo?.authorName && commentData.replyTo.authorName.includes('@')) {
              try {
                const replyAuthorId = commentData.replyTo.authorId;
                if (replyAuthorId) {
                  const userDoc = await getDoc(doc(db, 'users', replyAuthorId));
                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    commentData.replyTo.authorName = userData.userName || 
                      `${userData.primer_nombre || ''} ${userData.primer_apellido || ''}`.trim() || 
                      'Usuario';
                  }
                }
              } catch (err) {
                console.error('Error al obtener datos del usuario de respuesta:', err);
              }
            }
            
            return commentData;
          })
        );
        setComments(arr);
        setLoadingComments(false);
      },
      (err) => {
        console.error("Error en el listener de comentarios:", err);
        setLoadingComments(false);
      }
    );

    return () => unsub();
  }, [postId]);

  const addComment = useCallback(async (text, replyTo = null) => {
    if (!postId) throw new Error("Se requiere postId");
    if (!currentUser?.uid) throw new Error("El usuario debe estar autenticado");

    const postRef = doc(db, "posts", postId);

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const displayName = userData?.userName || 
        `${userData?.primer_nombre || ''} ${userData?.primer_apellido || ''}`.trim() || 
        'Usuario';

      const batch = writeBatch(db);
      
      const commentData = {
        text: text.trim(),
        authorId: currentUser.uid,
        authorName: displayName,
        replyTo: replyTo ? {
          id: replyTo.id,
          authorId: replyTo.authorId || currentUser.uid,
          authorName: replyTo.authorName,
          text: replyTo.text,
        } : null,
        createdAt: serverTimestamp(),
      };

      const newCommentRef = doc(collection(db, "posts", postId, "comments"));
      batch.set(newCommentRef, commentData);

      batch.update(postRef, { "stats.comments": increment(1) });

      await batch.commit();
      return { success: true };
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      return { success: false, error };
    }
  }, [postId, currentUser]);

  return { comments, loadingComments, addComment };
}