import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Typography, Card, CardContent } from "@mui/material";

// Цветовая палитра
const COLORS = ["#D32F2F", "#7B1FA2", "#1976D2", "#F57C00", "#388E3C", "#FBC02D"];

interface CountryData {
  country: string;
  count: number;
}

interface Props {
  data: CountryData[];
  totalRacers: number;
}

const MapChart: React.FC<Props> = ({ data, totalRacers }) => {
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 3, p: 3 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Заголовок */}
        <Typography variant="subtitle2" sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>
          Registered Racers by Country
        </Typography>

        {/* Круговой график */}
        <ResponsiveContainer width={250} height={250}>
          <PieChart>
            {/* Серые незаполненные круги */}
            <Pie data={sortedData} dataKey="count" cx="50%" cy="50%" outerRadius={100} fill="#EAEAEA" />

            {/* Основные цветные круги */}
            <Pie
              data={sortedData}
              dataKey="count"
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius={30}
              outerRadius={100}
              cornerRadius={10}
              paddingAngle={5}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(value) => `${value} racers`}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Легенда */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, flexWrap: "wrap" }}>
          {sortedData.map((entry, index) => (
            <Box key={entry.country} sx={{ display: "flex", alignItems: "center", mx: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: COLORS[index % COLORS.length], mr: 1 }} />
              <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 500 }}>
                {entry.country}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MapChart;
