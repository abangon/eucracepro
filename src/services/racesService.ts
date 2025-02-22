import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

// Коллекция гонок в Firestore
const racesCollection = collection(db, "races");

// Функция для добавления новой гонки
export const addRace = async (race: { name: string; location: string; date: string }) => {
  try {
    await addDoc(racesCollection, race);
    console.log("Race added successfully!");
  } catch (error) {
    console.error("Error adding race:", error);
  }
};

// Функция для получения списка всех гонок
export const getRaces = async () => {
  try {
    const querySnapshot = await getDocs(racesCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching races:", error);
    return [];
  }
};
