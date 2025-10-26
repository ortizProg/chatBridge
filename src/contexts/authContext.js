import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../firebase';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    const signIn = async (email, password) => {
        console.log("🚀 ~ signIn ~ email:", email)
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("🚀 ~ signIn ~ userCredential:", userCredential)
            setUser(userCredential.user);
        })
        .catch(error => {
            console.log(error);
            console.log("🚀 ~ signIn ~ error.message:", error.message)
            Alert.alert(error.message);
        });
    }

    const signUp = async (email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("🚀 ~ signUp ~ userCredential:", userCredential)
            setUser(userCredential.user);
        })
        .catch(error => {
            console.log(error);
            Alert.alert(error.message);
        });
    }

    const value = useMemo(
        () => ({user, signIn, signUp}),
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