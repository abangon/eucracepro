import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Box, Typography, Card, CardContent } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";

// Функция для генерации цветов
const getColor = (index: number) => {
  const colors = ["#7B61FF", "#A084E8", "#C3A6F3", "#E5C7FF", "#FF69B4", "#32CD32", "#FFA500", "#00CED1"]; // Разнообразные цвета
  return colors[index % colors.length];
};

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
    <Card sx={{ boxShadow: 2, borderRadius: 3, p: 2 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Заголовок */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <PublicIcon sx={{ color: "#7B61FF", mr: 1 }} />
          <Typography variant="subtitle2" sx={{ fontSize: 16, fontWeight: 600 }}>
            Registered Racers by Country
          </Typography>
        </Box>

        {/* Круговой график */}
        <PieChart width={250} height={250}>
          {/* Серые незаполненные круги */}
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
            cornerRadius={10} // Закругляем концы
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
      </CardContent>
    </Card>
  );
};

export default MapChart;
