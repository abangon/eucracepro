import React from "react";
import {
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  CircularProgress,
} from "@mui/material";

// Определение типов пропсов
interface TelemetryItem {
  id: string;
  chipNumber: string;
  lapTimes: number[];
  bestLap: number | null;
  lastLap: number | null;
  totalLaps: number;
}

interface RaceTimingTableProps {
  telemetryData: TelemetryItem[];
  raceId?: string;
  loading: boolean;
}

const RaceTimingTable: React.FC<RaceTimingTableProps> = ({ telemetryData, loading }) => {
  // Отображаем индикатор загрузки
  if (loading) {
    return (
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, textAlign: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", p: 3 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Загрузка данных гонки...</Typography>
        </Box>
      </Paper>
    );
  }

  // Если данных нет
  if (telemetryData.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Race Timing
        </Typography>
        <Typography textAlign="center" p={2}>
          Нет данных для отображения
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Race Timing
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ textAlign: "center" }}><strong>Position</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Chip Number</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Best Lap</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Last Lap</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Total Laps</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {telemetryData.map((data, index) => (
              <TableRow key={data.id}>
                <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{data.chipNumber}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{data.bestLap ? data.bestLap.toFixed(2) : "-"}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{data.lastLap ? data.lastLap.toFixed(2) : "-"}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{data.totalLaps}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RaceTimingTable;
