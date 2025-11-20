import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const userLogin = userCredential?.user;
      const userInfo = await getUserInfo(userLogin.uid);
      setUser({...userLogin, ...userInfo});
    }).catch(error => {
      Alert.alert('Error al iniciar sesión', 'Las credenciales son invalidas');
    });
  };

  const getUserInfo = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data() ?? {};
  }

  const signUp = async (email, password, userName) => {
      createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          userName,
          email,
          createdAt: new Date().toISOString(),
        });
        setUser(userCredential.user);
      }).catch(error => {
        Alert.alert('Error al registrarse', 'No fue posible realizar su registro, posiblemente este correo ya se encuentre en uso');
      })
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
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
      const filename = `${userId}.jpg`;
      const storageRef = ref(storage, `users/${filename}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const saveImage = async (uri) => {
    const imageUrl = await uploadImage(uri, user.uid);
    await updateDoc(doc(db, "users", user.uid), {
      img: imageUrl,
    }).then((res) => {
      Alert.alert('Acción exitosa', 'Cambio de imágen realizado exitosamente')
    })
  }

  const logout = async () => {
    await signOut(auth).then(() => {
      setUser(null);
    }).catch(err => {
      Alert.alert('Error al cerrar sesión');
    });
  };

  const value = useMemo(
    () => ({ user, authLoading, signIn, signUp, logout, saveImage }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth está siendo utilizado fuera del AuthProvider');
  return ctx;
};
