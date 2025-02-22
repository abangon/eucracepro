import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

// Коллекция лидеров гонок
const leaderboardCollection = collection(db, "leaderboard");

// Добавление участника в таблицу лидеров
export const addParticipant = async (participant: { name: string; race: string; time: number }) => {
  try {
    await addDoc(leaderboardCollection, participant);
    console.log("Participant added successfully!");
  } catch (error) {
    console.error("Error adding participant:", error);
  }
};

// Получение списка участников в реальном времени
export const listenForLeaderboard = (callback: (data: any[]) => void) => {
  return onSnapshot(leaderboardCollection, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

// Обновление данных участника
export const updateParticipant = async (id: string, updatedData: { name?: string; race?: string; time?: number }) => {
  try {
    const participantDoc = doc(db, "leaderboard", id);
    await updateDoc(participantDoc, updatedData);
    console.log("Participant updated successfully!");
  } catch (error) {
    console.error("Error updating participant:", error);
  }
};

// Удаление участника
export const deleteParticipant = async (id: string) => {
  try {
    const participantDoc = doc(db, "leaderboard", id);
    await deleteDoc(participantDoc);
    console.log("Participant deleted successfully!");
  } catch (error) {
    console.error("Error deleting participant:", error);
  }
};
