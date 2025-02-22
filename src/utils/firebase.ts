import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  listUsers 
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

// ✅ Получение списка пользователей из Authentication (для админов)
const fetchAllUsers = async () => {
  try {
    const users = await listUsers(auth, 1000);
    return users.users.map(user => ({
      uid: user.uid,
      email: user.email,
      createdAt: new Date(user.metadata.creationTime)
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// ✅ Экспортируем все нужные функции и объекты
export { app, db, auth, signInWithGoogle, logOut, fetchAllUsers };
