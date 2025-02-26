import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
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
          chipNumber: doc.data().chipNumber?.toString() || "", // Преобразуем chipNumber в строку
        }));

        console.log("✅ Участники загружены:", participantsList);
        setParticipants(participantsList);
      } catch (error) {
        console.error("❌ Ошибка загрузки участников:", error);
      }
    };

    const fetchTelemetry = async () => {
      try {
        console.log(`📡 Загружаем телеметрию для гонки: ${raceId}`);
        const raceRef = doc(db, "races", raceId);
        const raceSnap = await getDoc(raceRef);

        if (!raceSnap.exists()) {
          console.warn("⚠️ Документ гонки не найден!");
          setTelemetry({});
          setLoading(false);
          return;
        }

        const raceData = raceSnap.data();
        const telemetryData = raceData.telemetry || {};
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
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Race Timing Table for {raceId}
      </Typography>

      <Paper elevation={3} sx={{ p: 2 }}>
        {loading ? (
          <Typography sx={{ textAlign: "center", p: 2 }}>Loading...</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Nickname</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Race Number</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Chip Number</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Best Lap</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Last Lap</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total Laps</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(telemetry).map((chip, index) => {
                  const chipString = chip.toString(); // Приводим ключи к строке
                  const participant = participants.find(p => p.chipNumber === chipString) || {};

                  // ⚡️ Фильтруем неверные значения (убираем < 3 сек и отрицательные)
                  const laps = (telemetry[chipString] || []).filter(lap => lap.lap_time >= 3);

                  // 📌 Найти лучший круг (если есть)
                  const bestLap = laps.length > 0 ? Math.min(...laps.map(lap => lap.lap_time)) : "-";
                  const lastLap = laps.length > 0 ? laps[laps.length - 1].lap_time : "-";
                  const totalLaps = laps.length || "-";

                  return (
                    <TableRow key={chipString}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{participant.nickname || "-"}</TableCell>
                      <TableCell>{participant.raceNumber || "-"}</TableCell>
                      <TableCell>{chipString}</TableCell>
                      <TableCell>{bestLap !== "-" ? bestLap.toFixed(3) : "-"}</TableCell>
                      <TableCell>{lastLap !== "-" ? lastLap.toFixed(3) : "-"}</TableCell>
                      <TableCell>{totalLaps}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default RaceTimingTable;
