import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD23QBtOhgndUNfrG1TBXC_gjJi-O4FOKQ",
  authDomain: "setech-ec094.firebaseapp.com",
  projectId: "setech-ec094",
  storageBucket: "setech-ec094.appspot.com",
  messagingSenderId: "762431852574",
  appId: "1:762431852574:web:39e003ac07e8100e22de0f"
};

// Check if we're using demo configuration
const isUsingDemoConfig =
  firebaseConfig.apiKey === "demo-api-key" ||
  !firebaseConfig.apiKey;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore (for better offline experience)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence');
      }
    });
}

// Log warning if using demo configuration
if (isUsingDemoConfig) {
  console.warn(
    "Firebase is using demo configuration. For full functionality, please set up proper Firebase environment variables."
  );
}

export const isDemoMode = isUsingDemoConfig;
export default app;