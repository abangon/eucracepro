import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface DriverTelemetry {
  lapTimes: number[];
}

const RaceDriverPage: React.FC = () => {
  const { raceId, chipNumber } = useParams<{ raceId: string; chipNumber: string }>();
  const [driverTelemetry, setDriverTelemetry] = useState<DriverTelemetry | null>(null);
  const [raceName, setRaceName] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("-");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!raceId || !chipNumber) return;

    const raceRef = doc(db, "races", raceId);

    const unsubscribe = onSnapshot(raceRef, (raceSnapshot) => {
      if (!raceSnapshot.exists()) {
        console.log(`Race ${raceId} not found.`);
        setDriverTelemetry(null);
        setLoading(false);
        return;
      }

      const raceData = raceSnapshot.data();
      console.log("Live Race data:", raceData);

      setRaceName(raceData.name || `Race ${raceId}`);

      if (!raceData.telemetry || !raceData.telemetry[chipNumber]) {
        setDriverTelemetry(null);
        setLoading(false);
        return;
      }

      const lapEntries = Object.values(raceData.telemetry[chipNumber]);

      const lapTimes = lapEntries
        .map((lap: any) => lap.lap_time)
        .filter((time: number | null) => time !== null && time >= 3.000);

      if (raceData.participants && raceData.participants[chipNumber]) {
        setDriverName(raceData.participants[chipNumber].name || "-");
      }

      setDriverTelemetry({ lapTimes });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [raceId, chipNumber]);

  const formatLapTime = (time: number | null) => {
    if (time === null) return "-";
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, "0")}`;
  };

  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading driver data...</Typography>;
  }

  if (!driverTelemetry || driverTelemetry.lapTimes.length === 0) {
    return <Typography sx={{ p: 3 }}>No valid lap data available for this driver.</Typography>;
  }

  const bestLap = Math.min(...driverTelemetry.lapTimes);

  return (
    <Box sx={{ p: 3 }}>
      {/* Кнопка Назад */}
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      {/* Заголовок с именем гонки и ID */}
      <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 4 }}>
        {raceName} ({raceId}) - {driverName} ({chipNumber})
      </Typography>

      {/* Таблица с кругами */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ textAlign: "center" }}>
                <strong>Lap #</strong>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <strong>Lap Time</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {driverTelemetry.lapTimes.map((time, index) => (
              <TableRow key={index}>
                <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: time === bestLap ? "bold" : "normal",
                  }}
                >
                  {formatLapTime(time)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RaceDriverPage;
