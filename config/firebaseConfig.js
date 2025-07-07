// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAoJXbd_yH9kczcw6VvNyKVUv6WW6VVGGY",
    authDomain: "dinetime-afe4a.firebaseapp.com",
    projectId: "dinetime-afe4a",
    storageBucket: "dinetime-afe4a.firebasestorage.app",
    messagingSenderId: "169891997265",
    appId: "1:169891997265:web:8814e1605186327f403a70",
    measurementId: "G-2XMMS0H4B5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});