import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Импорт Firestore

interface LapTime {
  lap: number;
  time: string;
  chipNumber: string;
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
      const racersCollection = collection(db, "races", "8915", "participants");
      const querySnapshot = await getDocs(racersCollection);
      const racersData: Record<string, Racer> = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Racer;
        racersData[data.chipNumber] = data;
      });

      setRacers(racersData);
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
            <TableCell>Nickname</TableCell>
            <TableCell>Race Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lapTimes.map((lapTime, index) => {
            const racer = racers[lapTime.chipNumber] || { nickname: "Unknown", raceNumber: "N/A" };
            return (
              <TableRow key={index}>
                <TableCell>{lapTime.lap}</TableCell>
                <TableCell>{lapTime.time}</TableCell>
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
