import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Get these from your Firebase Console settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances
export const db = getFirestore(app);
export const auth = getAuth(app);

// Simple Favorite Toggle Hook (Local State Mock)
export const useFavorites = () => {
  // In a real app, you would use Firestore to persist these
  const toggleFavorite = async (recipeId: string) => {
    console.log(`Toggling favorite for recipe: ${recipeId}`);
    // implementation would go here
  };

  return { toggleFavorite };
};
