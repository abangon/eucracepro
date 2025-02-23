import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";

// Обновленная палитра цветов
const colors = [
  "#D81B60", "#BA68C8", "#81D4FA", "#1E88E5", "#EC407A", "#8E24AA", "#FFB300",
  "#3949AB", "#FF7043", "#FFD54F", "#CE93D8", "#5D4037", "#F8BBD0", "#D7CCC8",
  "#66BB6A", "#616161"
];

const getColor = (index: number) => colors[index % colors.length];

interface CountryData {
  country: string;
  count: number;
}

interface Props {
  data: CountryData[];
  totalRacers: number;
}

const MapChart: React.FC<Props> = ({ data, totalRacers }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Сортируем страны по количеству гонщиков
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 3, p: 3 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Заголовок */}
        <Typography variant="subtitle2" sx={{ fontSize: 14, fontWeight: 500, color: "#555", mb: 2 }}>
          Registered Racers by Country
        </Typography>

        {/* Круговой график */}
        <PieChart width={250} height={250}>
          {/* Серый фон графика */}
          <Pie data={[{ value: 1 }]} dataKey="value" cx="50%" cy="50%" outerRadius={100} fill="#EAEAEA" />

          {/* Основные цветные круги */}
          <Pie
            data={sortedData}
            dataKey="count"
            cx="50%"
            cy="50%"
            startAngle={90} // Начинаем с 12 часов
            endAngle={-270}
            innerRadius={30}
            outerRadius={100}
            cornerRadius={10} // Закругленные края
            paddingAngle={5}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(index)}
                opacity={hoverIndex === index ? 0.7 : 1} // Затемнение при наведении
                onMouseEnter={() => setHoverIndex(index)}
                style={{ outline: "none" }} // Убираем рамку при клике
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name, props) => {
              const countryCount = Number(value);
              const percentage = totalRacers > 0 ? ((countryCount / totalRacers) * 100).toFixed(1) : "0";

              return [`${percentage}%`, props.payload.country];
            }}
          />
        </PieChart>

        {/* Легенда со странами */}
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", mt: 2 }}>
          {sortedData.map((entry, index) => (
            <Stack key={entry.country} direction="row" alignItems="center" spacing={1} sx={{ m: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: getColor(index) }} />
              <Typography variant="body2" sx={{ fontSize: 12, color: "#333", fontWeight: 500 }}>
                {entry.country}
              </Typography>
            </Stack>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MapChart;
