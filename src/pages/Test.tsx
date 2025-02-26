import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import React from "react";

const TestPage: React.FC = () => {
  console.log("🔥 TestPage loaded!"); // Проверяем, вызывается ли компонент

  return (
    <div>
      <h1>Test Page is working!</h1>
      <p>If you see this message, the component is rendered correctly.</p>
    </div>
  );
};

export default TestPage;


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
      <Typography>Loading...</Typography>
    </Box>
  );
};

export default TestPage;
