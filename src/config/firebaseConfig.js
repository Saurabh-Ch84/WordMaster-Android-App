import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// Import the specific persistence functions
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDOQRnKhf-2-XguqkM7Mm--n9XJ3S2CgtE",
  authDomain: "wordmaster-d807c.firebaseapp.com",
  projectId: "wordmaster-d807c",
  storageBucket: "wordmaster-d807c.firebasestorage.app",
  https:'https://wordmaster-d807c-default-rtdb.firebaseio.com/',
  messagingSenderId: "901813758790",
  appId: "1:901813758790:web:b7d9d0d995b2347911d347",
  measurementId: "G-XNV0Q942ST"
};

let app;
let auth;

try {
  // 1. Initialize App
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // 2. Initialize Auth with Persistence
  // We check if AsyncStorage is actually loaded to prevent crashes
  if (ReactNativeAsyncStorage) {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  } else {
    // Fallback if something fails (Safety net)
    auth = getAuth(app);
  }

} catch (error) {
  console.log("Firebase Error:", error);
  // Last resort fallback so app doesn't crash
  app = getApp(); 
  auth = getAuth(app);
}

const db = getDatabase(app);

export { db, auth };