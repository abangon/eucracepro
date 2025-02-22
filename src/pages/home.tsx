import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import MapChart from "../components/MapChart"; // Подключаем круговой гео-график

const Home: React.FC = () => {
  const [totalRacers, setTotalRacers] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [countryData, setCountryData] = useState<{ country: string; racers: number }[]>([]);

  useEffect(() => {
    const fetchActiveRacers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const users = usersSnapshot.docs.map(doc => doc.data());

        // Количество активных гонщиков (те, кто заполнил профиль)
        const totalUsers = users.length;
        setTotalRacers(totalUsers);

        // Группировка пользователей по странам
        const countryMap: Record<string, number> = {};
        users.forEach(user => {
          if (user.country) {
            countryMap[user.country] = (countryMap[user.country] || 0) + 1;
          }
        });

        // Преобразуем объект в массив для передачи в `MapChart`
        const formattedCountryData = Object.entries(countryMap).map(([country, racers]) => ({
          country,
          racers,
        }));
        setCountryData(formattedCountryData);

        // Определяем количество пользователей месяц назад
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const pastUsers = users.filter(user => new Date(user.createdAt) < oneMonthAgo).length;

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
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <SportsMotorsportsIcon fontSize="large" />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        {/* Круговая диаграмма с гонщиками по странам */}
        <Grid item xs={12}>
          <MapChart countryData={countryData} totalRacers={totalRacers} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
