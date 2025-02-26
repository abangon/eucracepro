import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase"; // Убедитесь, что путь правильный
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const RaceTimingTable = ({ raceId }) => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [participantsData, setParticipantsData] = useState({});
  const [loading, setLoading] = useState(true);

  // Функция для форматирования времени круга
  const formatLapTime = (time) => {
    if (time == null || time === undefined) return "-"; // Если данных нет, ставим прочерк
    return time.toFixed(3);
  };

  useEffect(() => {
    const fetchRaceData = async () => {
      try {
        console.log("📌 Fetching telemetry data...");
        const telemetryCollection = collection(db, "races", raceId, "telemetry");
        const telemetrySnapshot = await getDocs(telemetryCollection);

        const telemetry = [];
        telemetrySnapshot.forEach((doc) => {
          const chipNumber = doc.id; // Чип номер как ID документа
          const lapTimes = doc.data();

          if (lapTimes && lapTimes.length > 0) {
            const bestLap = Math.min(...lapTimes.map(lap => lap.lap_time || Infinity));
            const lastLap = lapTimes[lapTimes.length - 1]?.lap_time || "-";
            const totalLaps = lapTimes.length;

            telemetry.push({
              chipNumber,
              bestLap: bestLap === Infinity ? null : bestLap, // Если нет времени, ставим null
              lastLap,
              totalLaps
            });
          }
        });

        console.log("✅ Telemetry Data:", telemetry);
        setTelemetryData(telemetry);

        console.log("📌 Fetching participants data...");
        const participantsCollection = collection(db, "races", raceId, "participants");
        const participantsSnapshot = await getDocs(participantsCollection);

        const participants = {};
        participantsSnapshot.forEach((doc) => {
          const data = doc.data();
          participants[data.chipNumber] = {
            nickname: data.nickname || "-",
            raceNumber: data.raceNumber || "-"
          };
        });

        console.log("✅ Participants Data:", participants);
        setParticipantsData(participants);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching race data:", error);
        setLoading(false);
      }
    };

    fetchRaceData();
  }, [raceId]);

  if (loading) return <p>Loading...</p>;

  // 🔄 Сортировка по лучшему времени круга
  const sortedData = [...telemetryData].sort((a, b) => (a.bestLap || Infinity) - (b.bestLap || Infinity));

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Position</TableCell>
            <TableCell>Nickname</TableCell>
            <TableCell>Racer Number</TableCell>
            <TableCell>Chip Number</TableCell>
            <TableCell>Best Lap</TableCell>
            <TableCell>Last Lap</TableCell>
            <TableCell>Total Laps</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((record, index) => (
            <TableRow key={record.chipNumber}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{participantsData[record.chipNumber]?.nickname || "-"}</TableCell>
              <TableCell>{participantsData[record.chipNumber]?.raceNumber || "-"}</TableCell>
              <TableCell>{record.chipNumber}</TableCell>
              <TableCell>{formatLapTime(record.bestLap)}</TableCell>
              <TableCell>{formatLapTime(record.lastLap)}</TableCell>
              <TableCell>{record.totalLaps}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RaceTimingTable;
