import React from "react";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#6C63FF", "#8E7BFF", "#A496FF", "#C3B7FF", "#E1D8FF"];

const MapChart = ({ countryData, totalRacers }: { countryData: { country: string; racers: number }[], totalRacers: number }) => {
  return (
    <Card sx={{ boxShadow: 2, borderRadius: 3, p: 2, maxWidth: 400 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
          🌍 Registered Racers by Country
        </Typography>

        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Внешний круг (самый большой процент) */}
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="racers"
                isAnimationActive={true}
              >
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              {/* Средний круг */}
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                dataKey="racers"
                isAnimationActive={true}
              >
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              {/* Внутренний круг (наименьший процент) */}
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={20}
                outerRadius={40}
                paddingAngle={3}
                dataKey="racers"
                isAnimationActive={true}
              >
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
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
          {countryData.map((entry, index) => (
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
