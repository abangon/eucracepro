import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Paper } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Racer', width: 200 },
  { field: 'team', headerName: 'Team', width: 200 },
  { field: 'laps', headerName: 'Laps', type: 'number', width: 130 },
  { field: 'time', headerName: 'Best Time', width: 130 },
];

const rows = [
  { id: 1, name: 'John Doe', team: 'Red Bull', laps: 52, time: '1:12.345' },
  { id: 2, name: 'Jane Smith', team: 'Mercedes', laps: 49, time: '1:13.567' },
  { id: 3, name: 'Alex Johnson', team: 'Ferrari', laps: 50, time: '1:11.890' },
  { id: 4, name: 'Emily Davis', team: 'McLaren', laps: 47, time: '1:14.221' },
  { id: 5, name: 'Michael Brown', team: 'AlphaTauri', laps: 45, time: '1:15.789' },
];

const Leaderboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Leaderboard
      </Typography>
      <Paper sx={{ height: 400, width: '100%', p: 2 }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10]} />
      </Paper>
    </Box>
  );
};

export default Leaderboard;
