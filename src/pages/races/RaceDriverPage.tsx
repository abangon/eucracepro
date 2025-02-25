// src/pages/races/RaceDriverPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface LapData {
  lap_time: number | null;
  timestamp: string;
}

const RaceDriverPage: React.FC = () => {
  const { raceId, chipNumber } = useParams<{ raceId: string; chipNumber: string }>();
  const [lapTimes, setLapTimes] = useState<LapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLapTimes = async () => {
      if (!raceId || !chipNumber) return;
      try {
        // Доступ к документу гонщика внутри подколлекции telemetry
        const driverRef = collection(db, "races", raceId, "telemetry", chipNumber);
        const snapshot = await getDocs(driverRef);

        // Преобразуем данные в массив объектов
        const laps: LapData[] = snapshot.docs.map((doc) => doc.data() as LapData);

        // Сортируем по времени
        laps.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        setLapTimes(laps);
      } catch (error) {
        console.error("Error fetching lap times:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLapTimes();
  }, [raceId, chipNumber]);

  // Форматирование времени круга
  const formatLapTime = (time: number | null) => {
    if (time === null) return "-";
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, "0")}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Driver {chipNumber} - Race {raceId}
      </Typography>
      {loading ? (
        <Typography>Loading lap times...</Typography>
      ) : lapTimes.length === 0 ? (
        <Typography>No lap times available</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>Lap</strong>
                </TableCell>
                <TableCell>
                  <strong>Time</strong>
                </TableCell>
                <TableCell>
                  <strong>Timestamp</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lapTimes.map((lap, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatLapTime(lap.lap_time)}</TableCell>
                  <TableCell>{new Date(lap.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RaceDriverPage;
