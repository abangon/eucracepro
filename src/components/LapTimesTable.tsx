// src/components/LapTimesTable.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface LapTime {
  lap: number;
  time: string;
  chipNumber?: string;
  raceNumber?: string;
}

interface LapTimesTableProps {
  raceId: string;
  refreshTrigger: number; // 🔄 Триггер для обновления данных после сохранения
}

const LapTimesTable: React.FC<LapTimesTableProps> = ({ raceId, refreshTrigger }) => {
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);

  useEffect(() => {
    const fetchLapTimes = async () => {
      console.log("Fetching Lap Times...");
      const raceRef = doc(db, "races", raceId);
      const raceSnap = await getDoc(raceRef);

      if (raceSnap.exists()) {
        const raceData = raceSnap.data();
        const telemetryData = raceData.telemetry || {};

        let formattedLapTimes: LapTime[] = Object.keys(telemetryData).map((chipNumber) => ({
          lap: Number(chipNumber), // Используем chipNumber как идентификатор
          time: telemetryData[chipNumber]?.lap_time || "-",
          chipNumber: chipNumber || "-",
          raceNumber: telemetryData[chipNumber]?.raceNumber || "-",
        }));

        setLapTimes(formattedLapTimes);
      }
    };

    fetchLapTimes();
  }, [raceId, refreshTrigger]); // 🔄 Обновление при изменении триггера

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Lap Times
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Chip Number</TableCell>
            <TableCell>Race Number</TableCell>
            <TableCell>Lap</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lapTimes.map((lapTime, index) => (
            <TableRow key={index}>
              <TableCell>{lapTime.chipNumber || "-"}</TableCell>
              <TableCell>{lapTime.raceNumber || "-"}</TableCell>
              <TableCell>{lapTime.lap}</TableCell>
              <TableCell>{lapTime.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default LapTimesTable;
