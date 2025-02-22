// src/pages/home.tsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";

const Home: React.FC = () => {
  const [totalRacers, setTotalRacers] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const usersCollection = collection(db, "users");
            const usersSnapshot = await getDocs(usersCollection);
            let users = usersSnapshot.docs.map(doc => doc.data());

            // 🔹 Если пользователь есть в Authentication, но нет в Firestore → добавляем его
            if (!users.find(u => u.uid === user.uid)) {
              const createdAt = user.metadata.creationTime || new Date().toISOString();
              await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                createdAt,
              });

              // 🔄 Обновляем список пользователей после добавления
              users = [...users, { uid: user.uid, createdAt }];
            }

            // 1️⃣ Общее количество зарегистрированных пользователей
            const totalUsers = users.length;
            setTotalRacers(totalUsers);

            // 2️⃣ Фильтруем пользователей, созданных до месяца назад
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            const pastUsers = users.filter(user => new Date(user.createdAt) < oneMonthAgo).length;

            // 3️⃣ Рассчитываем прирост (%)
            let growth = 0;
            if (pastUsers === 0 && totalUsers > 0) {
              growth = 300; // Если месяц назад было 0, значит рост 300%
            } else if (pastUsers > 0) {
              growth = ((totalUsers - pastUsers) / pastUsers) * 100;
            }

            setGrowthPercentage(parseFloat(growth.toFixed(1))); // Округляем до 1 знака
          }
        });
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
                  <Typography variant="body2">
                    +{growthPercentage}% last 30 days
                  </Typography>
                </Box>
              </Box>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <SportsMotorsportsIcon fontSize="large" />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
