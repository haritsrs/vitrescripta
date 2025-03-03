// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCd12bqoue7uHk-Ztjq--pPsrpKCRqQmf4',
  authDomain: 'vitrescripta.firebaseapp.com',
  projectId: 'vitrescripta',
  storageBucket: 'vitrescripta.firebasestorage.app',
  messagingSenderId: '228133750965',
  appId: '1:228133750965:web:fa0786da0ba3ece88e96fc',
  measurementId: 'G-QLMF5V4FKM',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
isSupported().then((isSupported) => {
  if (isSupported) {
    analytics = getAnalytics(app);
  }
});

// Export Firebase features
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export { analytics };
