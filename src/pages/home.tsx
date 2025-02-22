// src/pages/home.tsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import PeopleIcon from "@mui/icons-material/People";
import TimerIcon from "@mui/icons-material/Timer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

const Home: React.FC = () => {
  const [totalRacers, setTotalRacers] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = await getDocs(collection(db, "users"));
        const users = usersCollection.docs.map(doc => doc.data());

        // Общее количество уникальных пользователей (UID)
        const totalUsers = users.length;
        setTotalRacers(totalUsers);

        // Вычисляем пользователей за последние 30 дней
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        const recentUsers = users.filter(user => {
          return user.createdAt && new Date(user.createdAt.toDate()) >= oneMonthAgo;
        });

        // Рассчитываем прирост в %
        const newUsers = recentUsers.length;
        const growth = totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : "0";
        setGrowthPercentage(parseFloat(growth));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Total Active Racers (Firebase) */}
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

        {/* Total Participants */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 2, borderRadius: 3, p: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Participants
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  1,340
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1, color: "success.main" }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">+2.1% last 7 days</Typography>
                </Box>
              </Box>
              <Avatar sx={{ bgcolor: "secondary.main", width: 56, height: 56 }}>
                <PeopleIcon fontSize="large" />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Laps */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 2, borderRadius: 3, p: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Laps
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  15,230
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1, color: "success.main" }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">+1.5% last 7 days</Typography>
                </Box>
              </Box>
              <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56 }}>
                <TimerIcon fontSize="large" />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
