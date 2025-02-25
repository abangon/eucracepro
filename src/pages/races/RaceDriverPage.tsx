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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface DriverData {
  raceName: string;
  driverName: string;
  chipNumber: string;
  lapTimes: number[];
}

const RaceDriverPage: React.FC = () => {
  const { raceId, chipNumber } = useParams<{ raceId: string; chipNumber: string }>();
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!raceId || !chipNumber) return;

      console.log(`🚀 Fetching driver data for race: ${raceId}, chip: ${chipNumber}`);

      try {
        const raceRef = doc(db, "races", raceId);
        const raceSnapshot = await getDoc(raceRef);

        if (!raceSnapshot.exists()) {
          console.warn(`⚠️ Race ${raceId} not found.`);
          setLoading(false);
          return;
        }

        const raceData = raceSnapshot.data();
        console.log("✅ Live Race data:", raceData);

        if (!raceData.telemetry) {
          console.warn("⚠️ No telemetry data found.");
          setLoading(false);
          return;
        }

        // Логируем все доступные номера чипов
        console.log("📌 Available chipNumbers:", Object.keys(raceData.telemetry));

        let formattedChipNumber = chipNumber;

        // Проверяем, есть ли чип в базе без ведущих нулей
        if (!raceData.telemetry[formattedChipNumber]) {
          console.warn(`⚠️ Chip ${chipNumber} not found. Checking without leading zeros...`);
          formattedChipNumber = chipNumber.replace(/^0+/, ""); // Убираем ведущие нули
        }

        console.log(`🔍 Searching for chip: ${formattedChipNumber}`);

        if (!raceData.telemetry[formattedChipNumber]) {
          console.warn(`❌ Chip ${formattedChipNumber} still not found in telemetry.`);
          setLoading(false);
          return;
        }

        const lapEntries = Object.values(raceData.telemetry[formattedChipNumber]);
        console.log(`✅ Found telemetry for chip ${formattedChipNumber}:`, lapEntries);

        const lapTimes = lapEntries
          .map((lap: any) => lap.lap_time)
          .filter((time: number | null) => time !== null && time >= 3.000);

        if (lapTimes.length === 0) {
          console.warn(`⚠️ No valid lap times found for chip: ${formattedChipNumber}`);
          setLoading(false);
          return;
        }

        setDriverData({
          raceName: raceData.name || `Race ${raceId}`,
          driverName: raceData.participants?.[formattedChipNumber]?.name || "-",
          chipNumber: formattedChipNumber,
          lapTimes,
        });
      } catch (error) {
        console.error("❌ Error fetching driver data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [raceId, chipNumber]);

  const formatLapTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, "0")}`;
  };

  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading driver data...</Typography>;
  }

  if (!driverData) {
    return <Typography sx={{ p: 3 }}>No valid data available for this driver.</Typography>;
  }

  const bestLap = Math.min(...driverData.lapTimes);

  return (
    <Box sx={{ p: 3 }}>
      {/* Кнопка "Назад" */}
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      {/* Заголовок */}
      <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 4 }}>
        {driverData.raceName} ({raceId}) - {driverData.driverName} ({driverData.chipNumber})
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
            {driverData.lapTimes.map((time, index) => (
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
