import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import MapChart from "../components/MapChart";
import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";

const Home: React.FC = () => {
  const [totalRacers, setTotalRacers] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [countryData, setCountryData] = useState<{ country: string; count: number }[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; count: number }[]>([]);

  useEffect(() => {
    const fetchActiveRacers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const users = usersSnapshot.docs.map(doc => doc.data());

        // 1️⃣ Подсчет активных гонщиков
        const totalUsers = users.length;
        setTotalRacers(totalUsers);

        // 2️⃣ Группируем пользователей по странам
        const countryCounts: { [key: string]: number } = {};
        users.forEach(user => {
          if (user.country) {
            countryCounts[user.country] = (countryCounts[user.country] || 0) + 1;
          }
        });

        const formattedData = Object.keys(countryCounts).map(country => ({
          country,
          count: countryCounts[country],
        }));

        setCountryData(formattedData);

        // 3️⃣ Определяем количество пользователей месяц назад
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const pastUsers = users.filter(user => new Date(user.createdAt) < oneMonthAgo).length;

        let growth = 0;
        if (pastUsers === 0) {
          growth = totalUsers > 0 ? totalUsers * 100 : 0;
        } else {
          growth = ((totalUsers - pastUsers) / pastUsers) * 100;
        }

        setGrowthPercentage(parseFloat(growth.toFixed(1)));

        // 4️⃣ Статистика новых пользователей за последние 7 дней
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(today.getDate() - i);
          return { date, count: 0 };
        }).reverse(); // Отображаем в хронологическом порядке

        users.forEach(user => {
          const createdAt = new Date(user.createdAt);
          last7Days.forEach(day => {
            if (createdAt.toDateString() === day.date.toDateString()) {
              day.count += 1;
            }
          });
        });

        setWeeklyData(
          last7Days.map(day => ({
            day: day.date.toDateString(),
            count: day.count,
          }))
        );
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
              {/* Гистограмма новых пользователей */}
              <Box sx={{ width: 80, height: 50 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      content={({ active, payload }) => (active && payload && payload.length ? (
                        <Box sx={{ background: "#fff", p: 1, borderRadius: 1, boxShadow: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            {payload[0].value}
                          </Typography>
                        </Box>
                      ) : null)}
                    />
                    <Bar
                      dataKey="count"
                      fill="#7B61FF"
                      radius={[5, 5, 0, 0]}
                      barSize={10}
                      minPointSize={2} // Маленькие столбцы для дней с 0
                      background={{ fill: "#EAEAEA" }} // Серые незаполненные дни
                    />
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
