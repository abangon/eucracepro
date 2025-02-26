import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
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
  CircularProgress,
} from "@mui/material";

const RaceTimingTable: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  console.log("🏁 raceId from URL:", raceId);

  const [participants, setParticipants] = useState<any[]>([]);
  const [telemetry, setTelemetry] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [loadingTelemetry, setLoadingTelemetry] = useState(true);

  useEffect(() => {
    if (!raceId) {
      console.error("❌ Ошибка: raceId не найден!");
      return;
    }

    const fetchParticipants = async () => {
      try {
        console.log(`🚀 Загружаем участников для гонки: ${raceId}`);
        setLoadingParticipants(true);

        const participantsCollection = collection(db, "races", raceId, "participants");
        const querySnapshot = await getDocs(participantsCollection);

        if (querySnapshot.empty) {
          console.warn("⚠️ Нет участников!");
          setParticipants([]);
        } else {
          const participantsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("✅ Участники загружены:", participantsList);
          setParticipants(participantsList);
        }
      } catch (error) {
        console.error("❌ Ошибка загрузки участников:", error);
      } finally {
        setLoadingParticipants(false);
      }
    };

    const fetchTelemetry = async () => {
      try {
        console.log(`📡 Загружаем телеметрию для гонки: ${raceId}`);
        setLoadingTelemetry(true);

        const raceRef = doc(db, "races", raceId);
        const raceSnap = await getDoc(raceRef);

        if (!raceSnap.exists()) {
          console.warn("⚠️ Документ гонки не найден!");
          setTelemetry({});
        } else {
          const raceData = raceSnap.data();
          const telemetryData = raceData.telemetry || {};

          // Фильтруем некорректные времена
          const filteredTelemetry = Object.keys(telemetryData).reduce((acc, chip) => {
            const laps = telemetryData[chip].filter(
              (lap: any) => lap.lap_time > 3 && lap.lap_time >= 0
            );
            acc[chip] = laps;
            return acc;
          }, {} as any);

          console.log("✅ Фильтрованная телеметрия:", filteredTelemetry);
          setTelemetry(filteredTelemetry);
        }
      } catch (error) {
        console.error("❌ Ошибка загрузки телеметрии:", error);
      } finally {
        setLoadingTelemetry(false);
      }
    };

    setLoading(true);
    fetchParticipants();
    fetchTelemetry();
  }, [raceId]);

  useEffect(() => {
    if (!loadingParticipants && !loadingTelemetry) {
      setLoading(false);
    }
  }, [loadingParticipants, loadingTelemetry]);

  return (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {loadingParticipants ? "Загружаем участников..." : ""}
            {loadingTelemetry ? " Загружаем данные телеметрии..." : ""}
          </Typography>
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Race Timing
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Position</TableCell>
                  <TableCell sx={{ textAlign: "left", fontWeight: "bold" }}>Nickname</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Race Number</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Chip Number</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Best Lap</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Last Lap</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>Total Laps</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(telemetry)
                  .map((chip) => {
                    const participant = participants.find((p) => p.chipNumber === chip) || {};
                    const bestLap =
                      telemetry[chip].length > 0
                        ? Math.min(...telemetry[chip].map((lap: any) => lap.lap_time))
                        : "-";
                    const lastLap =
                      telemetry[chip].length > 0
                        ? telemetry[chip][telemetry[chip].length - 1].lap_time
                        : "-";
                    const totalLaps = telemetry[chip]?.length || "-";

                    return {
                      chip,
                      nickname: participant.nickname || "-",
                      raceNumber: participant.raceNumber || "-",
                      bestLap,
                      lastLap,
                      totalLaps,
                    };
                  })
                  .sort((a, b) => (a.bestLap === "-" ? 1 : b.bestLap === "-" ? -1 : a.bestLap - b.bestLap))
                  .map((data, index) => (
                    <TableRow key={data.chip}>
                      <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                      <TableCell sx={{ textAlign: "left" }}>{data.nickname}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{data.raceNumber}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{data.chip}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{data.bestLap}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{data.lastLap}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{data.totalLaps}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default RaceTimingTable;
