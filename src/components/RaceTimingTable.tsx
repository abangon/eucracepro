import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase"; // ✅ Используем правильный импорт
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const RaceTimingTable: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  console.log("🏁 raceId from URL:", raceId);

  const [participants, setParticipants] = useState<any[]>([]);
  const [telemetry, setTelemetry] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!raceId) {
      console.error("❌ Ошибка: raceId не найден!");
      return;
    }

    const fetchParticipants = async () => {
      try {
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
      } catch (error) {
        console.error("❌ Ошибка загрузки участников:", error);
      }
    };

   // ✅ Загружаем документ гонки и достаем поле telemetry
const fetchTelemetry = async () => {
  try {
    console.log(`📡 Загружаем телеметрию для гонки: ${raceId}`);
    
    const raceRef = doc(db, "races", raceId); // 🔥 Правильный путь к документу
    const raceSnap = await getDoc(raceRef);

    if (!raceSnap.exists()) {
      console.warn("⚠️ Документ гонки не найден!");
      setTelemetry({});
      setLoading(false);
      return;
    }

    const raceData = raceSnap.data();
    const telemetryData = raceData.telemetry || {}; // ✅ Берем поле telemetry
    console.log("✅ Телеметрия загружена:", telemetryData);
    setTelemetry(telemetryData);
  } catch (error) {
    console.error("❌ Ошибка загрузки телеметрии:", error);
  }
};
    fetchParticipants();
    fetchTelemetry();
    setLoading(false);
  }, [raceId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Race Timing Table for {raceId}
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Nickname</TableCell>
                <TableCell>Race Number</TableCell>
                <TableCell>Chip Number</TableCell>
                <TableCell>Best Lap</TableCell>
                <TableCell>Last Lap</TableCell>
                <TableCell>Total Laps</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(telemetry).map((chip, index) => {
                const participant = participants.find(p => p.chipNumber === chip) || {};
                return (
                  <TableRow key={chip}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{participant.nickname || "-"}</TableCell>
                    <TableCell>{participant.raceNumber || "-"}</TableCell>
                    <TableCell>{chip}</TableCell>
                    <TableCell>{telemetry[chip]?.bestLap || "-"}</TableCell>
                    <TableCell>{telemetry[chip]?.lastLap || "-"}</TableCell>
                    <TableCell>{telemetry[chip]?.totalLaps || "-"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RaceTimingTable;
