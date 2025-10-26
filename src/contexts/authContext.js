import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

import { auth } from '../firebase';

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

    const signUp = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
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