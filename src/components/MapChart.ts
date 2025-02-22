import React, { useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { RadialBarChart, RadialBar, Tooltip, Legend } from "recharts";

interface MapChartProps {
  countryData: { country: string; racers: number }[];
  totalRacers: number;
}

const COLORS = ["#4CAF50", "#FFC107", "#FF5722", "#03A9F4", "#9C27B0", "#FF9800"];

const MapChart: React.FC<MapChartProps> = ({ countryData, totalRacers }) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const data = countryData.map((item, index) => ({
    name: item.country,
    value: (item.racers / totalRacers) * 100, // % от общего числа
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 3, p: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
          🌍 Registered Racers by Country
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 350 }}>
          <RadialBarChart
            width={400}
            height={350}
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="100%"
            barSize={15}
            data={data}
            onMouseMove={(e) => setHoveredCountry(e?.activePayload?.[0]?.payload?.name || null)}
            onMouseLeave={() => setHoveredCountry(null)}
          >
            <RadialBar minAngle={15} background dataKey="value" />
            <Tooltip formatter={(value, name) => [`${value.toFixed(1)}%`, name]} />
          </RadialBarChart>
        </Box>

        {/* Центр диаграммы */}
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h4" fontWeight="bold">
            {totalRacers}
          </Typography>
        </Box>

        {/* Легенда */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          {data.map((item, index) => (
            <Box key={item.name} sx={{ display: "flex", alignItems: "center", mx: 1 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: item.fill, borderRadius: "50%", mr: 1 }} />
              <Typography variant="body2" color={hoveredCountry === item.name ? "primary" : "textSecondary"}>
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MapChart;
