import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface TelemetryRecord {
  id: string;
  chipNumber: string; // Теперь чип-номер всегда строка, поддерживает любые символы
  lapTimes: number[];
  bestLap: number | null;
  lastLap: number | null;
  totalLaps: number;
}

const RaceDetailPage: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const [telemetryData, setTelemetryData] = useState<TelemetryRecord[]>([]);
  const [raceName, setRaceName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTelemetry = async () => {
      if (!raceId) return;
      try {
        console.log(`Fetching telemetry data for race: ${raceId}`);

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

        setRaceName(raceData.name || `Race ${raceId}`);

        const telemetryData: TelemetryRecord[] = [];

        Object.keys(raceData.telemetry).forEach((chipNumber) => {
          const lapEntries = Object.values(raceData.telemetry[chipNumber]);

          const lapTimes = lapEntries
            .map((lap: any) => lap.lap_time)
            .filter((lap: number | null) => lap !== null && lap >= 3.000);

          if (lapTimes.length === 0) return;

          telemetryData.push({
            id: chipNumber,
            chipNumber, // Оставляем чип в оригинальном виде, поддерживает буквы и длинные строки
            lapTimes,
            bestLap: Math.min(...lapTimes),
            lastLap: lapTimes[lapTimes.length - 1],
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

  const formatLapTime = (time: number | null) => {
    if (time === null) return "-";
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, "0")}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Кнопка Назад */}
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      {/* Заголовок с именем гонки и ID */}
      <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 4 }}>
        {raceName} ({raceId})
      </Typography>

      {loading ? (
        <Typography>Loading telemetry data...</Typography>
      ) : telemetryData.length === 0 ? (
        <Typography>No valid telemetry data available</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ textAlign: "left" }}>
                  <strong>Name</strong>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <strong>Racer Number</strong>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <strong>Chip Number</strong>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <strong>Best Lap</strong>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <strong>Last Lap</strong>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
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
                  <TableCell sx={{ textAlign: "left" }}>{/* Name - пока пусто */}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{/* Racer Number - пока пусто */}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                    {record.chipNumber}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{formatLapTime(record.bestLap)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{formatLapTime(record.lastLap)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{record.totalLaps}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export d
