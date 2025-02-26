import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Box, Typography } from "@mui/material";

const TestPage: React.FC = () => {
  console.log("🔥 TestPage loaded!"); // Проверяем, загружается ли компонент

  const { raceId } = useParams<{ raceId: string }>();
  console.log("🏁 raceId from URL:", raceId); // Проверяем, получаем ли raceId

  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 useEffect запущен!"); // Проверяем, запускается ли useEffect

    const fetchParticipants = async () => {
      try {
        if (!raceId) {
          console.error("❌ Ошибка: raceId не найден!");
          return;
        }

        console.log(`🚀 Загружаем участников для гонки: ${raceId}`);
        const participantsCollection = collection(db, "races", raceId, "participants");
        const querySnapshot = await getDocs(participantsCollection);

        if (querySnapshot.empty) {
          console.warn("⚠️ Нет участников!");
          setParticipants([]);
          setLoading(false);
          return;
        }

        const participantsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("✅ Участники загружены:", participantsList);
        setParticipants(participantsList);
        setLoading(false);
      } catch (error) {
        console.error("❌ Ошибка загрузки участников:", error);
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [raceId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Participants for Race {raceId}
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : participants.length === 0 ? (
        <Typography>No participants found.</Typography>
      ) : (
        participants.map((p) => (
          <Box key={p.id} sx={{ p: 2, borderBottom: "1px solid gray" }}>
            <Typography><b>Nickname:</b> {p.nickname || "N/A"}</Typography>
            <Typography><b>Race Number:</b> {p.raceNumber || "N/A"}</Typography>
            <Typography><b>Chip Number:</b> {p.chipNumber || "N/A"}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default TestPage;
