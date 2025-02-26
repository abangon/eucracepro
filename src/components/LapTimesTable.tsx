import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

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
  const [loading, setLoading] = useState(true); // 👈 Добавляем состояние загрузки

  useEffect(() => {
    const fetchRaceData = async () => {
  try {
    console.log("Fetching race data from Firestore...");

    const raceDocRef = doc(db, "races", "8915");
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

    // 📌 1️⃣ Добавляем ВСЕ chipNumber из `telemetry`
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

    // 📌 2️⃣ Загружаем `participants`
    console.log("Fetching participants...");
    const racersCollection = collection(db, "races", "8915", "participants");
    const querySnapshot = await getDocs(racersCollection);

    console.log("📌 Checking if querySnapshot has documents:", querySnapshot.empty ? "❌ No participants found!" : "✅ Participants found");

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("📌 Found participant document:", doc.id, "=>", data);

      if (!data.chipNumber) {
        console.warn(`⚠️ Participant ${doc.id} has no chipNumber!`);
        return;
      }

      let formattedChip = data.chipNumber.trim();
      console.log(`🔄 Checking participant chipNumber: ${formattedChip}`);

      if (racersData.hasOwnProperty(formattedChip)) {
        console.log(`✅ Found matching chipNumber in telemetry: ${formattedChip}`);
        racersData[formattedChip].nickname = data.nickname || "Unknown Racer";
        racersData[formattedChip].raceNumber = data.raceNumber || "-";
        console.log(`✅ Updated racer:`, racersData[formattedChip]);
      } else {
        console.warn(`⚠️ ChipNumber ${formattedChip} from participants is NOT in telemetry!`);
      }
    });

    // 📌 3️⃣ Если нет совпадений, ставим "Unknown Racer"
    Object.keys(racersData).forEach(chip => {
      if (racersData[chip].nickname === "-") {
        racersData[chip].nickname = "Unknown Racer";
        racersData[chip].raceNumber = "-";
      }
    });

    console.log("✅ Final racersData object:", racersData);
    setRacers(racersData);
    setLoading(false); // ✅ Теперь загрузка всегда завершается
  } catch (error) {
    console.error("❌ Error fetching race data:", error);
    setLoading(false);
  }
};


    fetchRaceData();
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Lap Times
      </Typography>

      {loading ? ( // 👈 Показываем загрузку, пока данные не загружены
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
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
      )}
    </Box>
  );
};

export default LapTimesTable;
