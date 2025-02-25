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

interface TelemetryRecord {
  id: string;
  chipNumber: number;
  lapTimes: number[];
  bestLap: number | null;
  lastLap: number | null;
  totalLaps: number;
}

const RaceDetailPage: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const [telemetryData, setTelemetryData] = useState<TelemetryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      if (!raceId) return;
      try {
        console.log(`Fetching telemetry data for race: ${raceId}`);

        const telemetryRef = collection(db, "races", raceId, "telemetry");
        const telemetrySnapshot = await getDocs(telemetryRef);

        const telemetryData: TelemetryRecord[] = [];

        for (const chipDoc of telemetrySnapshot.docs) {
          const chipNumber = chipDoc.id;
          console.log(`Found chip: ${chipNumber}`);

          // 🔥 Запрашиваем круги внутри конкретного чипа
          const lapsRef = collection(db, "races", raceId, "telemetry", chipNumber);
          const lapsSnapshot = await getDocs(lapsRef);

          const lapTimes: number[] = [];
          lapsSnapshot.docs.forEach((lapDoc) => {
            const lapData = lapDoc.data();
            if (lapData.lap_time !== null && lapData.lap_time !== undefined) {
              lapTimes.push(lapData.lap_time);
            }
          });

          const bestLap = lapTimes.length > 0 ? Math.min(...lapTimes) : null;
          const lastLap = lapTimes.length > 0 ? lapTimes[lapTimes.length - 1] : null;
          const totalLaps = lapTimes.length;

          telemetryData.push({
            id: chipNumber,
            chipNumber: parseInt(chipNumber),
            lapTimes,
            bestLap,
            lastLap,
            totalLaps,
          });
        }

        console.log("Final telemetry data:", telemetryData);
        setTelemetryData(telemetryData);
      } catch (error) {
        console.error("Error fetching telemetry data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetry();
  }, [raceId]);

  // Форматирование времени круга (например, 10.893 -> 0:10.893)
  const formatLapTime = (time: number | null) => {
    if (time === null) return "-";
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
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Racer Number</strong>
                </TableCell>
                <TableCell>
                  <strong>Chip Number</strong>
                </TableCell>
                <TableCell>
                  <strong>Best Lap</strong>
                </TableCell>
                <TableCell>
                  <strong>Last Lap</strong>
                </TableCell>
                <TableCell>
                  <strong>Total Laps</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {telemetryData.map((record) => (
                <TableRow
                  key={record.id}
                  hover
                  component={Link}
                  to={`/races/${raceId}/driver/${record.chipNumber}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <TableCell>{/* Name - пока пусто */}</TableCell>
                  <TableCell>{/* Racer Number - пока пусто */}</TableCell>
                  <TableCell>{record.chipNumber}</TableCell>
                  <TableCell>{formatLapTime(record.bestLap)}</TableCell>
                  <TableCell>{formatLapTime(record.lastLap)}</TableCell>
                  <TableCell>{record.totalLaps}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RaceDetailPage;
