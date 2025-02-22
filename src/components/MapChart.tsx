import React from "react";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#6C63FF", "#8E7BFF", "#A496FF", "#C3B7FF", "#E1D8FF"];

const MapChart = ({ countryData, totalRacers }: { countryData: { country: string; racers: number }[], totalRacers: number }) => {
  // Сортируем страны по количеству гонщиков (по убыванию)
  const sortedCountries = [...countryData].sort((a, b) => b.racers - a.racers);

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 3, p: 2, maxWidth: 400 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
          🌍 Registered Racers by Country
        </Typography>

        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {sortedCountries.map((entry, index) => (
                <Pie
                  key={entry.country}
                  data={[entry]} // Каждое Pie отображает одну страну
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={20 + index * 25} // Внутренний круг = самый большой процент
                  outerRadius={40 + index * 25}
                  paddingAngle={3}
                  dataKey="racers"
                  isAnimationActive={true}
                >
                  <Cell fill={COLORS[index % COLORS.length]} />
                </Pie>
              ))}
              <Tooltip formatter={(value, name, props) => [`${((value as number) / totalRacers * 100).toFixed(1)}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Центрируем общий счет */}
        <Box sx={{ textAlign: "center", mt: -12 }}>
          <Typography variant="h5" fontWeight="bold">{totalRacers}</Typography>
          <Typography variant="body2" color="text.secondary">Total</Typography>
        </Box>

        {/* Легенда */}
        <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
          {sortedCountries.map((entry, index) => (
            <Box key={entry.country} sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: COLORS[index % COLORS.length], borderRadius: "50%", mr: 1 }} />
              <Typography variant="body2">{entry.country}</Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MapChart;
