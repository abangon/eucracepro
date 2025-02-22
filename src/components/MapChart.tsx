import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

// Цвета для стран (можно доработать)
const COLORS = ["#6C63FF", "#8E7BFF", "#A496FF", "#C3B7FF", "#E1D8FF"];

const MapChart = ({ countryData, totalRacers }: { countryData: { country: string; racers: number }[], totalRacers: number }) => {
  return (
    <Card sx={{ boxShadow: 2, borderRadius: 3, p: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
          🌍 Registered Racers by Country
        </Typography>

        <Box sx={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="racers"
              >
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MapChart;
