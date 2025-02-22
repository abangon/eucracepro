import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";

const COLORS = ["#6A5ACD", "#8A2BE2", "#7B68EE", "#9370DB", "#BA55D3"]; // Фиолетовые оттенки
const GRAY_COLOR = "#E0E0E0"; // Серый для фона

const MapChart = ({ data }: { data: { country: string; count: number }[] }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 3, p: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <PublicIcon sx={{ color: "primary.main", mr: 1 }} />
          <Typography variant="subtitle2" sx={{ fontSize: 16, fontWeight: 600 }}>
            Registered Racers by Country
          </Typography>
        </Box>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            {/* Серый фон */}
            <Pie
              data={[{ value: 1 }]} // Одна секция, заполняющая круг
              dataKey="value"
              outerRadius={90}
              fill={GRAY_COLOR}
            />
            {/* Основные данные */}
            <Pie
              data={data}
              dataKey="count"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={5}
              startAngle={90} // Начало с 12 часов
              endAngle={-270} // Направление против часовой стрелки
              cornerRadius={10} // Закругленные концы
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`${((value as number / total) * 100).toFixed(1)}%`, props.payload.country]} />
          </PieChart>
        </ResponsiveContainer>
        {/* Легенда */}
        <Box display="flex" justifyContent="center" mt={2}>
          {data.map((entry, index) => (
            <Box key={index} display="flex" alignItems="center" mx={1}>
              <Box sx={{ width: 10, height: 10, bgcolor: COLORS[index % COLORS.length], borderRadius: "50%", mr: 1 }} />
              <Typography variant="body2">{entry.country}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MapChart;
