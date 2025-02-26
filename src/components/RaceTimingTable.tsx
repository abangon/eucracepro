import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface RaceTimingTableProps {
  telemetryData: any[];
  raceId: string;
  loading: boolean;
}

const formatLapTime = (time: number | null) => {
  if (time === null) return "-";
  const minutes = Math.floor(time / 60);
  const seconds = (time % 60).toFixed(3);
  return `${minutes}:${seconds.padStart(6, "0")}`;
};

const RaceTimingTable: React.FC<RaceTimingTableProps> = ({ telemetryData, raceId, loading }) => {
  const [participants, setParticipants] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchParticipants = async () => {
      const participantsRef = collection(db, "races", raceId, "participants");
      const snapshot = await getDocs(participantsRef);
      const participantsData: Record<string, string> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        participantsData[data.chipNumber] = data.nickname || `Participant ${data.chipNumber}`;
      });

      setParticipants(participantsData);
    };

    if (raceId) {
      fetchParticipants();
    }
  }, [raceId]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Race Timing
      </Typography>

      {loading ? (
        <Typography>Loading telemetry data...</Typography>
      ) : telemetryData.length === 0 ? (
        <Typography>No valid telemetry data available</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ textAlign: "center" }}><strong>Position</strong></TableCell>
                <TableCell sx={{ textAlign: "left" }}><strong>Nickname</strong></TableCell>
                <TableCell sx={{ textAlign: "center" }}><strong>Racer Number</strong></TableCell>
                <TableCell sx={{ textAlign: "center" }}><strong>Chip Number</strong></TableCell>
                <TableCell sx={{ textAlign: "center" }}><strong>Best Lap</strong></TableCell>
                <TableCell sx={{ textAlign: "center" }}><strong>Last Lap</strong></TableCell>
                <TableCell sx={{ textAlign: "center" }}><strong>Total Laps</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {telemetryData.map((record, index) => (
                <TableRow
                  key={record.id}
                  hover
                  component={Link}
                  to={`/races/${raceId}/driver/${record.chipNumber}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    <Select
                      value={participants[record.chipNumber] || ""}
                      displayEmpty
                      sx={{ width: "100%" }}
                    >
                      {Object.entries(participants).map(([chip, nickname]) => (
                        <MenuItem key={chip} value={nickname}>{nickname}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}></TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{record.chipNumber}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{formatLapTime(record.bestLap)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{formatLapTime(record.lastLap)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{record.totalLaps}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default RaceTimingTable;
