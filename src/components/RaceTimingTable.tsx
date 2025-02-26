import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/utils/firebase";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface Participant {
  chipNumber: string;
  nickname: string;
  raceNumber: string;
}

interface RacerData {
  chipNumber: string;
  nickname: string;
  raceNumber: string;
  bestLap: string;
  lastLap: string;
  totalLaps: number;
}

const RaceTimingTable: React.FC = () => {
  const { raceId } = useParams();
  const [racers, setRacers] = useState<RacerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaceData = async () => {
      try {
        console.log(`📌 Fetching race data for raceId: ${raceId}`);

        // 📌 1️⃣ Загружаем участников (participants)
        const participantsRef = collection(db, "races", raceId!, "participants");
        const participantsSnap = await getDocs(participantsRef);

        const participants: Participant[] = participantsSnap.docs.map(doc => doc.data() as Participant);
        console.log("✅ Participants loaded:", participants);

        // 📌 2️⃣ Загружаем телеметрию (telemetry)
        const raceRef = collection(db, "races");
        const raceSnap = await getDocs(raceRef);
        const raceData = raceSnap.docs.find(doc => doc.id === raceId)?.data();
        const telemetry = raceData?.telemetry || {};
        console.log("✅ Telemetry data:", telemetry);

        // 📌 3️⃣ Сопоставляем участников и телеметрию
        const racersData: RacerData[] = Object.entries(telemetry).map(([chipNumber, lapData]: any) => {
          // Форматируем чип, добавляя нули
          const formattedChipNumber = String(chipNumber).padStart(8, "0");

          // Ищем участника с таким чипом
          const participant = participants.find(p => p.chipNumber === formattedChipNumber);

          return {
            chipNumber: formattedChipNumber,
            nickname: participant?.nickname || "-",
            raceNumber: participant?.raceNumber || "-",
            bestLap: lapData?.[0]?.lap_time ? `${lapData[0].lap_time.toFixed(3)}` : "-",
            lastLap: lapData?.[lapData.length - 1]?.lap_time ? `${lapData[lapData.length - 1].lap_time.toFixed(3)}` : "-",
            totalLaps: lapData?.length || 0,
          };
        });

        console.log("✅ Final racersData:", racersData);
        setRacers(racersData);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching race data:", error);
        setLoading(false);
      }
    };

    fetchRaceData();
  }, [raceId]);

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
          {racers.length > 0 ? (
            racers.map((racer, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{racer.nickname}</TableCell>
                <TableCell>{racer.raceNumber}</TableCell>
                <TableCell>{racer.chipNumber}</TableCell>
                <TableCell>{racer.bestLap}</TableCell>
                <TableCell>{racer.lastLap}</TableCell>
                <TableCell>{racer.totalLaps}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                {loading ? "Loading..." : "No data available"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RaceTimingTable;
