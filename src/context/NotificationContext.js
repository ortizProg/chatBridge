import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useAuth } from './AuthContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {

  const { user } = useAuth();

  const [expoPushToken, setExpoPushToken] = useState(undefined);
  const [notification, setNotification] = useState(
    undefined
  );

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError('Project ID not found');
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        return pushTokenString;
      } catch (e) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    //   Alert.alert(notification)
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      Alert.alert(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const registerNotificationToken = async () => {
    registerForPushNotificationsAsync()
        .then(async (token) => {
          await updateDoc(doc(db, "users", user.uid), {
            notificationPushToken: token,
          }).then((res) => {
            setExpoPushToken(token)
          }).catch(error => {
            console.log(error)
          });
        })
        .catch((error) => setExpoPushToken(undefined));  
  }

  const getNotificationTokenByUser = async (uid) => {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.data()?.notificationPushToken ?? undefined;
  }

  const notificationsCollectionRef = (userId) =>
    collection(db, 'users', userId, 'notifications');

  const createNotification = async (
    userId,
    data
  ) => {
    const docRef = await addDoc(notificationsCollectionRef(userId), {
      userId,
      title: data.title,
      title: data.body,
      read: false,
      createdAt: new Date().toISOString(),
    });

    sendPushNotification(userId, data.title, data?.body, data?.data);

    return docRef.id;
  };

  async function sendPushNotification(userUid, title, body, data = {}) {

    const token = await getNotificationTokenByUser(userUid);

    if (!token) return;

    const message = {
      to: token,
      sound: 'default',
      title,
      body,
      data,
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  const clearToken = async () => {
    setExpoPushToken(undefined);
  }


  function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  const value = useMemo(
    () => ({ expoPushToken, sendPushNotification, registerNotificationToken, clearToken, createNotification }),
    [expoPushToken]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification está siendo utilizado fuera del AuthProvider');
  return ctx;
};
