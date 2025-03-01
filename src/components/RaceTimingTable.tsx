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
} from "@mui/material";

const RaceTimingTable: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate();
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

  const formatLapTime = (time: number | string) => {
    if (time === "-") return "-";
    const timeInSeconds = Number(time);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = (timeInSeconds % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, "0")}`;
  };

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
        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} // Уменьшаем шрифт на мобильных
      >
        Race Timing
      </Typography>

      {sortedTelemetry.length === 0 ? (
        <Typography variant="body1" textAlign="center">
          No data available for this race.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflowX: "auto", // Добавляем горизонтальную прокрутку
            minWidth: 0, // Убираем минимальную ширину для адаптивности
          }}
        >
          <Table
            sx={{
              minWidth: 650, // Минимальная ширина для десктопа, но прокрутка на мобильных
              "& th, & td": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Уменьшаем шрифт на мобильных
                padding: { xs: "6px 8px", sm: "8px 16px" }, // Уменьшаем отступы на мобильных
              },
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ textAlign: "center" }}><strong>Position</strong></TableCell>
                <TableCell sx={{ textAlign: { xs: "left", sm: "center" } }}>
                  <strong>Nickname</strong>
                </TableCell>
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
                    <TableCell sx={{ textAlign: { xs: "left", sm: "center" } }}>
                      {data.nickname}
                    </TableCell>
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
      )}
    </Paper>
  );
};

export default RaceTimingTable;
