import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Добавляем useNavigate
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const RaceTimingTable: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate(); // Для навигации
  console.log("🏁 raceId from URL:", raceId);

  const [participants, setParticipants] = useState<any[]>([]);
  const [telemetry, setTelemetry] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!raceId) {
      console.error("❌ Ошибка: raceId не найден!");
      setError("Race ID not found");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Загружаем участников
        console.log(`🚀 Загружаем участников для гонки: ${raceId}`);
        const participantsCollection = collection(db, "races", raceId, "participants");
        const querySnapshot = await getDocs(participantsCollection);

        const participantsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("✅ Участники загружены:", participantsList);
        setParticipants(participantsList);

        // Загружаем телеметрию
        console.log(`📡 Загружаем телеметрию для гонки: ${raceId}`);
        const raceRef = doc(db, "races", raceId);
        const raceSnap = await getDoc(raceRef);

        if (!raceSnap.exists()) {
          console.warn("⚠️ Документ гонки не найден!");
          setTelemetry({});
          return;
        }

        const raceData = raceSnap.data();
        let telemetryData = raceData.telemetry || {};

        // Фильтруем неверные значения
        Object.keys(telemetryData).forEach((chip) => {
          telemetryData[chip] = telemetryData[chip].filter(
            (lap: any) => lap.lap_time >= 3 && lap.lap_time > 0
          );
        });

        console.log("✅ Фильтрованная телеметрия:", telemetryData);
        setTelemetry(telemetryData);
      } catch (error) {
        console.error("❌ Ошибка загрузки данных:", error);
        setError("Failed to load race data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [raceId]);

  // Преобразуем данные в массив и сортируем по Best Lap
  const sortedTelemetry = Object.keys(telemetry).map((chip) => {
    const bestLap = telemetry[chip].length ? Math.min(...telemetry[chip].map((lap: any) => lap.lap_time)) : "-";
    const lastLap = telemetry[chip]?.[telemetry[chip].length - 1]?.lap_time || "-";
    const totalLaps = telemetry[chip]?.length || "-";
    const participant = participants.find((p) => p.chipNumber === chip) || {};

    return {
      chip,
      bestLap,
      lastLap,
      totalLaps,
      nickname: participant.nickname || "-",
      raceNumber: participant.raceNumber || "-",
    };
  }).sort((a, b) => (a.bestLap === "-" ? 1 : b.bestLap === "-" ? -1 : a.bestLap - b.bestLap));

  // Обработчик клика по строке
  const handleRowClick = (chip: string) => {
    if (raceId && chip) {
      navigate(`/race/${raceId}/driver/${chip}`); // Перенаправляем на RaceDriverPage
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Race Timing
      </Typography>

      {sortedTelemetry.length === 0 ? (
        <Typography variant="body1" textAlign="center">
          No data available for this race.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ textAlign: "center" }}><strong>Position</strong></TableCell>
                <TableCell><strong>Nickname</strong></TableCell>
                <TableCell sx={{ textAlign: "center" }}><strong>Race Number</strong></TableCell>
                <TableCell sx={{ textAlign: "center" }}><strong>Chip Number</strong></TableCell>
                <TableCell sx={{ textAlign: "center" }}><strong>Best Lap</strong></TableCell>
                <TableCell sx={{ textAlign: "center" }}><strong>Last Lap</strong></TableCell>
                <TableCell sx={{ textAlign: "center" }}><strong>Total Laps</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTelemetry.map((data, index) => (
                <TableRow
                  key={data.chip}
                  onClick={() => handleRowClick(data.chip)} // Добавляем обработчик клика
                  sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }} // Добавляем визуальный эффект
                >
                  <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                  <TableCell>{data.nickname}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{data.raceNumber}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{data.chip}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{data.bestLap}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{data.lastLap}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{data.totalLaps}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default RaceTimingTable;
