import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";

// Коллекция гонок
const racesCollection = collection(db, "races");

// Добавление новой гонки
export const addRace = async (race: { name: string; location: string; date: string }) => {
  try {
    await addDoc(racesCollection, race);
    console.log("Race added successfully!");
  } catch (error) {
    console.error("Error adding race:", error);
  }
};

// Получение списка гонок
export const getRaces = async () => {
  try {
    const querySnapshot = await getDocs(racesCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching races:", error);
    return [];
  }
};

// Обновление гонки
export const updateRace = async (id: string, updatedData: { name?: string; location?: string; date?: string }) => {
  try {
    const raceDoc = doc(db, "races", id);
    await updateDoc(raceDoc, updatedData);
    console.log("Race updated successfully!");
  } catch (error) {
    console.error("Error updating race:", error);
  }
};

// Удаление гонки
export const deleteRace = async (id: string) => {
  try {
    const raceDoc = doc(db, "races", id);
    await deleteDoc(raceDoc);
    console.log("Race deleted successfully!");
  } catch (error) {
    console.error("Error deleting race:", error);
  }
};
