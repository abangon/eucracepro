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
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import RegistrationForm from "../../components/RegistrationForm";

const RaceDetailPage: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [raceName, setRaceName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!raceId) return;

    const raceRef = doc(db, "races", raceId);

    const unsubscribe = onSnapshot(raceRef, (raceSnapshot) => {
      if (!raceSnapshot.exists()) {
        console.log(`Race ${raceId} not found.`);
        setTelemetryData([]);
        setLoading(false);
        return;
      }

      const raceData = raceSnapshot.data();
      console.log("Live Race data:", raceData);

      setRaceName(raceData.name || `Race ${raceId}`);

      if (!raceData.telemetry) {
        setTelemetryData([]);
        setLoading(false);
        return;
      }

      const telemetryArray = Object.keys(raceData.telemetry).map((chipNumber) => {
        const lapEntries = Object.values(raceData.telemetry[chipNumber]);
        const lapTimes = lapEntries
          .map((lap: any) => lap.lap_time)
          .filter((time: number | null) => time !== null && time >= 3.000);

        return {
          id: chipNumber,
          chipNumber,
          lapTimes,
          bestLap: lapTimes.length > 0 ? Math.min(...lapTimes) : null,
          lastLap: lapTimes.length > 0 ? lapTimes[lapTimes.length - 1] : null,
          totalLaps: lapTimes.length,
        };
      });

      const sortedTelemetry = telemetryArray.filter((r) => r.bestLap !== null);
      sortedTelemetry.sort((a, b) => (a.bestLap ?? Infinity) - (b.bestLap ?? Infinity));

      setTelemetryData(sortedTelemetry);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [raceId]);

  const formatLapTime = (time: number | null) => {
    if (time === null) return "-";
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, "0")}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Кнопка "Назад" */}
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      {/* Название гонки */}
      <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 4 }}>
        {raceName} ({raceId})
      </Typography>

      {/* Блок регистрации участников */}
      <RegistrationForm raceId={raceId} />

      {/* Блок Race Timing */}
      <Paper sx={{ p: 3, borderRadius: 2, mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Race Timing
        </Typography>

        {loading ? (
          <Typography>Loading telemetry data...</Typography>
        ) : telemetryData.length === 0 ? (
          <Typography>No valid telemetry data available</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ textAlign: "center" }}>
                    <strong>Position</strong>
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    <strong>Nickname</strong>
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
                {telemetryData.map((record, index) => (
                  <TableRow
                    key={record.id}
                    hover
                    component={Link}
                    to={`/races/${raceId}/driver/${record.chipNumber}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ textAlign: "left" }}>
                      {/* Name - пока пусто */}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {/* Racer Number - пока пусто */}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {record.chipNumber}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {formatLapTime(record.bestLap)}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {formatLapTime(record.lastLap)}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {record.totalLaps}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default RaceDetailPage;
