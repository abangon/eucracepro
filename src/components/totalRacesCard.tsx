// src/components/totalRacesCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface TotalRacesCardProps {
  total: number;
}

// Пример данных для графика; замените на реальные данные при необходимости
const data = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 50 },
  { name: 'Mar', value: 45 },
  { name: 'Apr', value: 60 },
  { name: 'May', value: 55 },
  { name: 'Jun', value: 70 },
];

const TotalRacesCard: React.FC<TotalRacesCardProps> = ({ total }) => {
  return (
    <Card
      sx={{
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        p: 2,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 48,
                height: 48,
                mr: 2,
              }}
            >
              <SportsMotorsportsIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Total Races
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {total}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ mt: 2, height: 80 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="value" stroke="#7367F0" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalRacesCard;
