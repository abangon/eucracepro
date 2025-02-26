import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Убедись, что путь к Firebase верный

interface LapTime {
  lap: number;
  time: string;
  chipNumber: string | number; // Чип может быть строкой или числом
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
    const fetchRacers = async () => {
      try {
        console.log("Fetching racers from Firestore...");

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

          const formattedChip = data.chipNumber.toString().trim(); // Приводим к строке
          console.log(`Formatted chipNumber: ${formattedChip}`);

          racersData[formattedChip] = {
            chipNumber: formattedChip,
            nickname: data.nickname || "Unknown",
            raceNumber: data.raceNumber || "N/A",
          };
        });

        console.log("Final racersData object:", racersData);
        setRacers(racersData);
      } catch (error) {
        console.error("Error fetching racers:", error);
      }
    };

    fetchRacers();
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
            const chipNumber = lapTime.chipNumber.toString().trim(); // Приводим к строке
            const racer = racers[chipNumber] || { nickname: "Unknown", raceNumber: "N/A" };

            console.log(`Processing lapTime[${index}]:`, lapTime);
            console.log(`Matching lapTime chip: ${chipNumber} -> Found racer:`, racer);

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
