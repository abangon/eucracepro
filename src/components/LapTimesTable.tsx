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

    // 📌 1️⃣ Добавляем ВСЕ chipNumber из `telemetry` в racersData с прочерками
    let racersData: Record<string, Racer> = {};
    Object.keys(raceData.telemetry).forEach(chip => {
      let normalizedChip = chip.trim();
      racersData[normalizedChip] = {
        chipNumber: normalizedChip,
        nickname: "-",
        raceNumber: "-",
      };
    });

    console.log("✅ Initial racersData with empty participants:", racersData);

    // 📌 2️⃣ Загружаем `participants` и обновляем данные
    console.log("Fetching participants...");
    const racersCollection = collection(db, "races", "8915", "participants");
    const querySnapshot = await getDocs(racersCollection);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("🔍 Participant data:", data);

      if (!data.chipNumber) {
        console.warn(`⚠️ Participant ${doc.id} has no chipNumber!`);
        return;
      }

      let formattedChip = data.chipNumber.trim();
      console.log(`🔄 Checking participant chipNumber: ${formattedChip}`);

      // 📌 Исправленный код для обновления данных участников
      if (racersData.hasOwnProperty(formattedChip)) {
        console.log(`✅ Found matching chipNumber in telemetry: ${formattedChip}`);

        racersData[formattedChip].nickname = data.nickname || "-";
        racersData[formattedChip].raceNumber = data.raceNumber || "-";

        console.log(`✅ Updated racer:`, racersData[formattedChip]);
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
            let chipNumber = lapTime.chipNumber.toString().toLowerCase().trim();

            // Если chipNumber состоит только из цифр, удаляем ведущие нули
            if (/^\d+$/.test(chipNumber)) {
              chipNumber = chipNumber.replace(/^0+/, "");
            }

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
