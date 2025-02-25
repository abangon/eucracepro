// src/pages/races/RaceDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface Telemetry {
  chipNumber: number;
  lapTimes: number[]; // Время круга в секундах
}

interface TelemetryRecord extends Telemetry {
  id: string;
}

const RaceDetailPage: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const [telemetryData, setTelemetryData] = useState<TelemetryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      if (!raceId) return;
      try {
        // Предполагается, что данные телеметрии хранятся в подколлекции "telemetry" документа гонки
        const telemetryRef = collection(db, "races", raceId, "telemetry");
        const snapshot = await getDocs(telemetryRef);
        const data: TelemetryRecord[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TelemetryRecord[];
        setTelemetryData(data);
      } catch (error) {
        console.error("Error fetching telemetry data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetry();
  }, [raceId]);

  // Функция форматирования времени круга (например, перевод секунд в формат mm:ss.mmm)
  const formatLapTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, "0")}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Race Results
      </Typography>
      {loading ? (
        <Typography>Loading telemetry data...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Race Number</TableCell>
                <TableCell>Chip Number</TableCell>
                <TableCell>Best Lap</TableCell>
                <TableCell>Last Lap</TableCell>
                <TableCell>Total Laps</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {telemetryData.map((record) => {
                // Рассчитываем сводные данные
                const bestLap =
                  record.lapTimes.length > 0 ? Math.min(...record.lapTimes) : null;
                const lastLap =
                  record.lapTimes.length > 0
                    ? record.lapTimes[record.lapTimes.length - 1]
                    : null;
                const totalLaps = record.lapTimes.length;

                return (
                  <TableRow
                    key={record.id}
                    hover
                    component={Link}
                    to={`/races/${raceId}/driver/${record.chipNumber}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <TableCell>{/* Name (пока пустое) */}</TableCell>
                    <TableCell>{/* Race Number (пока пустое) */}</TableCell>
                    <TableCell>{record.chipNumber}</TableCell>
                    <TableCell>
                      {bestLap !== null ? formatLapTime(bestLap) : "-"}
                    </TableCell>
                    <TableCell>
                      {lastLap !== null ? formatLapTime(lastLap) : "-"}
                    </TableCell>
                    <TableCell>{totalLaps}</TableCell>
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

export default RaceDetailPage;
