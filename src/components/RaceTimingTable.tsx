import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase"; // ✅ Используем правильный импорт
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

const RaceTimingTable: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  console.log("🏁 raceId from URL:", raceId);

  const [participants, setParticipants] = useState<any[]>([]);
  const [telemetry, setTelemetry] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!raceId) {
      console.error("❌ Ошибка: raceId не найден!");
      return;
    }

    const fetchParticipants = async () => {
      try {
        console.log(`🚀 Загружаем участников для гонки: ${raceId}`);
        const participantsCollection = collection(db, "races", raceId, "participants");
        const querySnapshot = await getDocs(participantsCollection);

        if (querySnapshot.empty) {
          console.warn("⚠️ Нет участников!");
          setParticipants([]);
          setLoading(false);
          return;
        }

        const participantsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("✅ Участники загружены:", participantsList);
        setParticipants(participantsList);
      } catch (error) {
        console.error("❌ Ошибка загрузки участников:", error);
      }
    };

    const fetchTelemetry = async () => {
      try {
        console.log(`📡 Загружаем телеметрию для гонки: ${raceId}`);

        const raceRef = doc(db, "races", raceId);
        const raceSnap = await getDoc(raceRef);

        if (!raceSnap.exists()) {
          console.warn("⚠️ Документ гонки не найден!");
          setTelemetry({});
          setLoading(false);
          return;
        }

        const raceData = raceSnap.data();
        const telemetryData = raceData.telemetry || {};
        console.log("✅ Телеметрия загружена:", telemetryData);

        // Фильтруем некорректные времена
        const filteredTelemetry = Object.keys(telemetryData).reduce((acc, chip) => {
          const laps = telemetryData[chip].filter((lap: any) => lap.lap_time > 3 && lap.lap_time >= 0);
          acc[chip] = laps;
          return acc;
        }, {} as any);

        console.log("✅ Фильтрованная телеметрия:", filteredTelemetry);
        setTelemetry(filteredTelemetry);
      } catch (error) {
        console.error("❌ Ошибка загрузки телеметрии:", error);
      }
    };

    fetchParticipants();
    fetchTelemetry();
    setLoading(false);
  }, [raceId]);

  return (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Race Timing
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell>Nickname</TableCell>
                  <TableCell>Race Number</TableCell>
                  <TableCell>Chip Number</TableCell>
                  <TableCell>Best Lap</TableCell>
                  <TableCell>Last Lap</TableCell>
                  <TableCell>Total Laps</TableCell>
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
                      telemetry[chip].length > 0 ? telemetry[chip][telemetry[chip].length - 1].lap_time : "-";
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
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.nickname}</TableCell>
                      <TableCell>{data.raceNumber}</TableCell>
                      <TableCell>{data.chip}</TableCell>
                      <TableCell>{data.bestLap}</TableCell>
                      <TableCell>{data.lastLap}</TableCell>
                      <TableCell>{data.totalLaps}</TableCell>
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
