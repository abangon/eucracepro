import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  fetchSignInMethodsForEmail 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// ✅ Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Авторизация через Google
const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

// ✅ Выход из системы
const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// ✅ Проверка существования пользователей по email (Вместо listUsers)
const checkIfUserExists = async (email: string) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0; // Если есть методы входа, значит пользователь существует
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
  }
};

// ✅ Экспортируем все нужные функции и объекты
export { app, db, auth, signInWithGoogle, logOut, checkIfUserExists };
