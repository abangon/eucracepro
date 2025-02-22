import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

// Коллекция гонок
const racesCollection = collection(db, "races");

// Добавление гонки вручную (если нужно)
export const addRace = async (race: { name: string; location: string; date: string }) => {
  try {
    await addDoc(racesCollection, race);
    console.log("Race added successfully!");
  } catch (error) {
    console.error("Error adding race:", error);
  }
};

// Функция для автоматического обновления списка гонок
export const listenForRaces = (callback: (races: any[]) => void) => {
  return onSnapshot(racesCollection, (snapshot) => {
    const races = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(races);
  });
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
