import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import MapChart from "../components/MapChart"; // Круговой график

const Home: React.FC = () => {
  const [totalRacers, setTotalRacers] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [countryData, setCountryData] = useState<{ country: string; count: number }[]>([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchActiveRacers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const users = usersSnapshot.docs.map(doc => doc.data());

        // Количество активных гонщиков (заполнили профиль)
        const totalUsers = users.length;
        setTotalRacers(totalUsers);

        // Группируем по странам
        const countryCounts: { [key: string]: number } = {};
        users.forEach(user => {
          if (user.country) {
            countryCounts[user.country] = (countryCounts[user.country] || 0) + 1;
          }
        });

        // Формируем массив данных для графика
        const formattedData = Object.keys(countryCounts).map(country => ({
          country,
          count: countryCounts[country],
        }));

        setCountryData(formattedData);

        // Создаем данные за последние 7 дней для гистограммы
        const last7Days = [...Array(7)].map((_, i) => {
          const day = new Date();
          day.setDate(day.getDate() - i);
          return { date: day.toISOString().split("T")[0], count: 0 };
        }).reverse();

        users.forEach(user => {
          if (user.createdAt) {
            const createdAt = new Date(user.createdAt);
            if (!isNaN(createdAt.getTime())) {
              const formattedDate = createdAt.toISOString().split("T")[0];
              const dayEntry = last7Days.find(day => day.date === formattedDate);
              if (dayEntry) dayEntry.count += 1;
            }
          }
        });

        setWeeklyData(last7Days);

        // Определяем количество пользователей месяц назад
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const pastUsers = users.filter(user => user.createdAt && !isNaN(new Date(user.createdAt).getTime()) && new Date(user.createdAt) < oneMonthAgo).length;

        // Корректный расчет прироста (%)
        let growth = 0;
        if (pastUsers === 0) {
          growth = totalUsers > 0 ? totalUsers * 100 : 0;
        } else {
          growth = ((totalUsers - pastUsers) / pastUsers) * 100;
        }

        setGrowthPercentage(parseFloat(growth.toFixed(1)));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchActiveRacers();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Total Active Racers */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 2, borderRadius: 3, p: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Active Racers
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {totalRacers}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1, color: "success.main" }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">+{growthPercentage}% last 30 days</Typography>
                </Box>
              </Box>

              {/* Мини-гистограмма */}
              <Box sx={{ width: 100, height: 50 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip formatter={(value: any) => [`${value} new racers`, "Date"]} />
                    {weeklyData.map((entry, index) => (
                      <Bar
                        key={index}
                        dataKey="count"
                        fill={entry.count > 0 ? "#7B61FF" : "#D3D3D3"} // Серый цвет, если 0 участников
                        radius={[5, 5, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Круговой график стран */}
        <Grid item xs={12} md={4}>
          <MapChart data={countryData} totalRacers={totalRacers} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
