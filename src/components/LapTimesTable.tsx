import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Убедись, что путь к Firebase верный

interface LapTime {
  lap: number;
  time: string;
  chipNumber: string | number;
}

interface Racer {
  chipNumber: string;
  nickname: string;
  raceNumber: string;
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
        console.log("Race data:", raceData);

        if (!raceData?.telemetry) {
          console.warn("No telemetry data found in race!");
          return;
        }

        // 📌 1️⃣ Собираем chipNumber из telemetry и приводим к строке без ведущих нулей
        let telemetryData: Record<string, string> = {};
        Object.keys(raceData.telemetry).forEach(chip => {
          const normalizedChip = chip.toString().replace(/^0+/, ""); // Убираем ведущие нули
          telemetryData[normalizedChip] = chip;
        });

        console.log("Extracted telemetry chipNumbers:", telemetryData);

        // 📌 2️⃣ Загружаем `participants`
        console.log("Fetching participants...");
        const racersCollection = collection(db, "races", "8915", "participants");
        const querySnapshot = await getDocs(racersCollection);
        const racersData: Record<string, Racer> = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Participant data:", data);

          if (!data.chipNumber) {
            console.warn(`Participant ${doc.id} has no chipNumber!`);
            return;
          }

          let formattedChip = data.chipNumber.toString().trim().replace(/^0+/, ""); // Убираем ведущие нули

          // 📌 3️⃣ Проверяем, есть ли этот чип в `telemetry`
          if (telemetryData[formattedChip]) {
            console.log(`✅ Found matching chipNumber: ${formattedChip}`);

            racersData[formattedChip] = {
              chipNumber: formattedChip,
              nickname: data.nickname || "Unknown",
              raceNumber: data.raceNumber || "N/A",
            };
          } else {
            console.warn(`⚠️ ChipNumber ${formattedChip} from participants is NOT in telemetry!`);
          }
        });

        console.log("✅ Final racersData object:", racersData);
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
            const chipNumber = lapTime.chipNumber.toString().trim().replace(/^0+/, ""); // Убираем ведущие нули
            const racer = racers[chipNumber] || { nickname: "Unknown", raceNumber: "N/A" };

            console.log(`🔍 Processing lapTime[${index}]:`, lapTime);
            console.log(`🔄 Matching lapTime chip: ${chipNumber} -> Found racer:`, racer);

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
