// src/components/PointsTable.tsx
import React from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

interface Point {
  id: number;
  description: string;
  points: number;
}

interface PointsTableProps {
  points: Point[];
}

const PointsTable: React.FC<PointsTableProps> = ({ points }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Points Table
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {points.map((point, index) => (
            <TableRow key={index}>
              <TableCell>{point.id}</TableCell>
              <TableCell>{point.description}</TableCell>
              <TableCell>{point.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PointsTable;
