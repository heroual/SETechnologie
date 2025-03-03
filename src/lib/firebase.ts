import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your new Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD23QBtOhgndUNfrG1TBXC_gjJi-O4FOKQ",
  authDomain: "setech-ec094.firebaseapp.com",
  projectId: "setech-ec094",
  storageBucket: "setech-ec094.appspot.com",
  messagingSenderId: "762431852574",
  appId: "1:762431852574:web:39e003ac07e8100e22de0f"
};

// Check if we're using demo configuration (this remains unchanged)
const isUsingDemoConfig =
  firebaseConfig.apiKey === "demo-api-key" ||
  !firebaseConfig.apiKey;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Log warning if using demo configuration (this remains unchanged)
if (isUsingDemoConfig) {
  console.warn(
    "Firebase is using demo configuration. For full functionality, please set up proper Firebase environment variables."
  );
}

// IMPORTANT: CORS configuration for Firebase Storage must be done OUTSIDE of WebContainer
// using the `gsutil` command-line tool.  See the project README for instructions.
// The cors.json file in this project provides a TEMPORARY, INSECURE wildcard configuration
// that allows all origins.  This is ONLY for development within WebContainer and MUST be
// changed to specific origins before deploying to production.

export const isDemoMode = isUsingDemoConfig;
export default app;