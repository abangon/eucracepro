import React from "react";
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
} from "@mui/material";

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
                  <TableCell sx={{ textAlign: "left" }}></TableCell>
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
