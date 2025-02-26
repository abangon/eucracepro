import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from "@mui/material";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Путь к firebase

const LapTimesTable = () => {
  const [racers, setRacers] = useState<Record<string, { chipNumber: string, nickname: string, raceNumber: string }>>({});
  const [loading, setLoading] = useState(true);
  const raceId = "8915"; // Установите здесь динамическое значение raceId, например из URL

  useEffect(() => {
    const fetchRaceData = async () => {
      try {
        console.log("Fetching race data from Firestore...");

        // Получаем данные гонки
        const raceDocRef = doc(db, "races", raceId);
        const raceSnapshot = await getDoc(raceDocRef);

        if (!raceSnapshot.exists()) {
          console.warn("No race data found!");
          setLoading(false);
          return;
        }

        const raceData = raceSnapshot.data();

        if (!raceData?.telemetry) {
          console.warn("No telemetry data found in race!");
          setLoading(false);
          return;
        }

        // 1️⃣ Загружаем чипы из telemetry
        let racersData: Record<string, { chipNumber: string, nickname: string, raceNumber: string }> = {};
        Object.keys(raceData.telemetry).forEach((chip) => {
          let normalizedChip = chip.trim();
          racersData[normalizedChip] = {
            chipNumber: normalizedChip,
            nickname: "Unknown Racer",
            raceNumber: "-",
          };
        });

        console.log("Initial racersData:", racersData);

        // 2️⃣ Загружаем участников из коллекции participants
        console.log("Fetching participants...");
        const participantsCollection = collection(db, "races", raceId, "participants");
        const querySnapshot = await getDocs(participantsCollection);

        if (querySnapshot.empty) {
          console.warn("No participants found!");
          setLoading(false);
          return;
        }

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const participantId = doc.id; // Получаем уникальный id участника

          console.log("Found participant:", participantId, "=>", data);

          if (!data.chipNumber) {
            console.warn(`Participant ${participantId} has no chipNumber!`);
            return;
          }

          const formattedChip = data.chipNumber.trim();
          console.log(`Checking participant chipNumber: ${formattedChip}`);

          if (racersData.hasOwnProperty(formattedChip)) {
            console.log(`Found matching chipNumber in telemetry: ${formattedChip}`);
            racersData[formattedChip].nickname = data.nickname || "Unknown Racer";
            racersData[formattedChip].raceNumber = data.raceNumber || "-";
          } else {
            console.warn(`ChipNumber ${formattedChip} from participants is NOT in telemetry!`);
          }
        });

        console.log("Final racersData:", racersData);
        setRacers(racersData);
        setLoading(false); // Завершаем загрузку

      } catch (error) {
        console.error("Error fetching race data:", error);
        setLoading(false);
      }
    };

    fetchRaceData();
  }, [raceId]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Lap Times
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
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
            {Object.keys(racers).map((chip, index) => {
              const racer = racers[chip];

              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{racer.nickname}</TableCell>
                  <TableCell>{racer.raceNumber}</TableCell>
                  <TableCell>{racer.chipNumber}</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default LapTimesTable;
