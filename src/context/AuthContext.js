import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

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
    const userCredential = await signInWithEmailAndPassword(auth, email, password).then(userCredential => {
      setUser(userCredential.user);
    }).catch(error => {
      Alert.alert('Error al iniciar sesión', 'Las credenciales son invalidas');
    });
  };

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

  const logout = async () => {
    await signOut(auth).then(() => {
      setUser(null);
    }).catch(err => {
      Alert.alert('Error al cerrar sesión');
    });
  };

  const value = useMemo(
    () => ({ user, authLoading, signIn, signUp, logout }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth está siendo utilizado fuera del AuthProvider');
  return ctx;
};
