import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  useTheme, // Для доступа к theme и breakpoints
} from "@mui/material";

const RaceTimingTable: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate();
  const theme = useTheme(); // Получаем доступ к theme для breakpoints

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

        console.log(`🚀 Загружаем участников для гонки: ${raceId}`);
        const participantsCollection = collection(db, "races", raceId, "participants");
        const querySnapshot = await getDocs(participantsCollection);

        const participantsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("✅ Участники загружены:", participantsList);
        setParticipants(participantsList);

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

  // Функция форматирования времени
  const formatLapTime = (time: number | string) => {
    if (time === "-") return "-";
    const timeInSeconds = Number(time);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = (timeInSeconds % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, "0")}`;
  };

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

  // Находим лучшее время (для подсветки)
  const bestOverallLap = sortedTelemetry.length > 0
    ? Math.min(
        ...sortedTelemetry
          .filter((data) => data.bestLap !== "-")
          .map((data) => Number(data.bestLap))
      )
    : null;

  const handleRowClick = (chip: string) => {
    if (raceId && chip) {
      navigate(`/races/${raceId}/driver/${chip}`);
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
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 2 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        Race Timing
      </Typography>

      {sortedTelemetry.length === 0 ? (
        <Typography variant="body1" textAlign="center">
          No data available for this race.
        </Typography>
      ) : (
        <Box>
          {/* Карточки для мобильных устройств */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {sortedTelemetry.map((data, index) => {
              const isBestLap = bestOverallLap !== null && data.bestLap === bestOverallLap;
              return (
                <Paper
                  key={data.chip}
                  onClick={() => handleRowClick(data.chip)}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    cursor: "pointer",
                    backgroundColor: isBestLap ? "#fffde7" : "inherit", // Золотистый фон для лучшего круга
                    "&:hover": { backgroundColor: "#f0f0f0" },
                    display: "flex",
                    flexDirection: "column",
                    gap: 1, // Отступы между элементами
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Position: {index + 1}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Nickname:</strong> {data.nickname}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Race Number:</strong> {data.raceNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Chip Number:</strong> {data.chip}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Best Lap:</strong> {formatLapTime(data.bestLap)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Last Lap:</strong> {formatLapTime(data.lastLap)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Laps:</strong> {data.totalLaps}
                  </Typography>
                </Paper>
              );
            })}
          </Box>

          {/* Таблица для десктопных устройств */}
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              display: { xs: "none", md: "block" }, // Показываем только на десктопе
              minWidth: 650,
            }}
          >
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
                {sortedTelemetry.map((data, index) => {
                  const isBestLap = bestOverallLap !== null && data.bestLap === bestOverallLap;
                  return (
                    <TableRow
                      key={data.chip}
                      onClick={() => handleRowClick(data.chip)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                        backgroundColor: isBestLap ? "#fffde7" : "inherit",
                      }}
                    >
                      <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                      <TableCell>{data.nickname}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{data.raceNumber}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{data.chip}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{formatLapTime(data.bestLap)}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{formatLapTime(data.lastLap)}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{data.totalLaps}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Paper>
  );
};

export default RaceTimingTable;
