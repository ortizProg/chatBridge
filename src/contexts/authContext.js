import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from '../firebase';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
            } else {
                setUser(null)
            }
        })
        return () => unsubscribe();
    }, []);
    
    const signIn = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setUser(userCredential.user);
        })
        .catch(error => {
            console.log(error);
            Alert.alert(error.message);
        });
    }

    const signUp = async (email, password, userName) => {
        return await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            await setDoc(doc(db, "users", userCredential.user.uid), {
                userName,
                email,
                createdAt: new Date().toISOString(),
            });
            setUser(userCredential.user);
        })
        .catch(error => {
            console.log(error);
            Alert.alert(error.message);
        });
    }

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            return true;
        } catch (error) {
            console.log(error);
            Alert.alert('Error al cerrar sesión', error.message);
        }
    }

    const value = useMemo(
        () => ({user, signIn, signUp, logout}),
        [user]
    )
        
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error('useAuth esta siento utilizado fuera del contexto');
    return ctx;
}