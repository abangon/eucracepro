import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Проверь путь к Firebase

interface LapTime {
  lap: number;
  time: string;
  chipNumber: string | number;
}

interface Racer {
  chipNumber: string;
  nickname: string;
  raceNumber: string;
  error?: string;
}

interface LapTimesTableProps {
  lapTimes: LapTime[];
}

const LapTimesTable: React.FC<LapTimesTableProps> = ({ lapTimes }) => {
  const [racers, setRacers] = useState<Record<string, Racer>>({});

  useEffect(() => {
    const fetchRaceData = async () => {
      try {
        console.log("Fetching race data from Firestore...");

        const raceDocRef = doc(db, "races", "8915");
        const raceSnapshot = await getDoc(raceDocRef);

        if (!raceSnapshot.exists()) {
          console.warn("No race data found!");
          return;
        }

        const raceData = raceSnapshot.data();

        if (!raceData?.telemetry) {
          console.warn("No telemetry data found in race!");
          return;
        }

        // 📌 1️⃣ Заполняем racersData ВСЕМИ чипами из telemetry с "Error: telemetry"
        let racersData: Record<string, Racer> = {};
        Object.keys(raceData.telemetry).forEach(chip => {
          let normalizedChip = chip.trim();
          racersData[normalizedChip] = {
            chipNumber: normalizedChip,
            nickname: "Error: telemetry",
            raceNumber: "Error: telemetry",
          };
        });

        // 📌 2️⃣ Загружаем `participants`
        console.log("Fetching participants...");
        const racersCollection = collection(db, "races", "8915", "participants");
        const querySnapshot = await getDocs(racersCollection);

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (!data.chipNumber) {
            return;
          }

          let formattedChip = data.chipNumber.trim();

          // Если `chipNumber` есть в `telemetry`, обновляем данные
          if (racersData.hasOwnProperty(formattedChip)) {
            racersData[formattedChip].nickname = data.nickname || "Error: update";
            racersData[formattedChip].raceNumber = data.raceNumber || "Error: update";
          } else {
            // Если `chipNumber` нет в `telemetry`, ставим ошибку
            racersData[formattedChip] = {
              chipNumber: formattedChip,
              nickname: "Error: participants",
              raceNumber: "Error: participants",
            };
          }
        });

        setRacers(racersData);
      } catch (error) {
        console.error("❌ Error fetching race data:", error);
      }
    };

    fetchRaceData();
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Lap Times
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Lap</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Chip Number</TableCell>
            <TableCell>Nickname</TableCell>
            <TableCell>Race Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lapTimes.map((lapTime, index) => {
            let chipNumber = lapTime.chipNumber.toString().trim();
            const racer = racers[chipNumber] || {
              chipNumber,
              nickname: "Error: missing",
              raceNumber: "Error: missing",
            };

            return (
              <TableRow key={index}>
                <TableCell>{lapTime.lap}</TableCell>
                <TableCell>{lapTime.time}</TableCell>
                <TableCell>{chipNumber}</TableCell>
                <TableCell>{racer.nickname}</TableCell>
                <TableCell>{racer.raceNumber}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

export default LapTimesTable;
