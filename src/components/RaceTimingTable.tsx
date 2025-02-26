import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { db } from "../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

const RaceTimingTable = ({ raceId }) => {
  const [timingData, setTimingData] = useState([]);
  const [participants, setParticipants] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaceData = async () => {
      try {
        console.log("Fetching telemetry data...");
        const telemetryRef = collection(db, "races", raceId, "telemetry");
        const telemetrySnap = await getDocs(telemetryRef);
        
        let telemetryData = [];
        telemetrySnap.forEach((doc) => {
          telemetryData.push({ chipNumber: doc.id, laps: doc.data() });
        });
        console.log("Loaded telemetry data:", telemetryData);

        console.log("Fetching participants...");
        const participantsRef = collection(db, "races", raceId, "participants");
        const participantsSnap = await getDocs(participantsRef);
        
        let participantsMap = {};
        participantsSnap.forEach((doc) => {
          let data = doc.data();
          participantsMap[data.chipNumber] = {
            nickname: data.nickname || "-",
            raceNumber: data.raceNumber || "-",
          };
        });
        console.log("Loaded participants:", participantsMap);

        const finalData = telemetryData.map((item, index) => ({
          position: index + 1,
          chipNumber: item.chipNumber,
          nickname: participantsMap[item.chipNumber]?.nickname || "-",
          raceNumber: participantsMap[item.chipNumber]?.raceNumber || "-",
          bestLap: item.laps[1]?.lap_time || "-",
          lastLap: item.laps[item.laps.length - 1]?.lap_time || "-",
          totalLaps: item.laps.length || "-",
        }));

        setTimingData(finalData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching race data:", error);
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
          {timingData.map((row) => (
            <TableRow key={row.chipNumber}>
              <TableCell>{row.position}</TableCell>
              <TableCell>{row.nickname}</TableCell>
              <TableCell>{row.raceNumber}</TableCell>
              <TableCell>{row.chipNumber}</TableCell>
              <TableCell>{row.bestLap}</TableCell>
              <TableCell>{row.lastLap}</TableCell>
              <TableCell>{row.totalLaps}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loading && <p>Loading...</p>}
    </TableContainer>
  );
};

export default RaceTimingTable;
