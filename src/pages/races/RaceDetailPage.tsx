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
import { doc, getDoc } from "firebase/firestore";
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

        // Получаем сам документ гонки
        const raceRef = doc(db, "races", raceId);
        const raceSnapshot = await getDoc(raceRef);

        if (!raceSnapshot.exists()) {
          console.log(`Race ${raceId} not found.`);
          setLoading(false);
          return;
        }

        const raceData = raceSnapshot.data();
        console.log("Race data:", raceData);

        if (!raceData.telemetry) {
          console.log("No telemetry data found.");
          setLoading(false);
          return;
        }

        const telemetryData: TelemetryRecord[] = [];

        Object.keys(raceData.telemetry).forEach((chipNumber) => {
          const lapEntries = Object.values(raceData.telemetry[chipNumber]);
          const lapTimes = lapEntries
            .map((lap: any) => lap.lap_time)
            .filter((lap: number | null) => lap !== null);

          telemetryData.push({
            id: chipNumber,
            chipNumber: parseInt(chipNumber),
            lapTimes,
            bestLap: lapTimes.length > 0 ? Math.min(...lapTimes) : null,
            lastLap: lapTimes.length > 0 ? lapTimes[lapTimes.length - 1] : null,
            totalLaps: lapTimes.length,
          });
        });

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
        Race Results
      </Typography>
      {loading ? (
        <Typography>Loading telemetry data...</Typography>
      ) : telemetryData.length === 0 ? (
        <Typography>No telemetry data available</Typography>
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
