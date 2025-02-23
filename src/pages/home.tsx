import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import MapChart from "../components/MapChart";
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis } from "recharts";

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

        const totalUsers = users.length;
        setTotalRacers(totalUsers);

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

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const pastUsers = users.filter(user => new Date(user.createdAt) < oneWeekAgo).length;

        let growth = 0;
        if (pastUsers === 0) {
          growth = totalUsers > 0 ? totalUsers * 100 : 0;
        } else {
          growth = ((totalUsers - pastUsers) / pastUsers) * 100;
        }

        setGrowthPercentage(parseFloat(growth.toFixed(1)));

        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(today.getDate() - i);
          return { date, count: 0 };
        }).reverse();

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
      <Grid container spacing={3}>
        {/* Total Active Racers */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 2, borderRadius: 3, p: 3 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {/* Левая часть (текст) */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: 14, fontWeight: 600 }}>
                  Total active users
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ fontSize: 32 }}>
                  {totalRacers.toLocaleString()}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, color: "success.main", gap: 0.5 }}>
                  <TrendingUpIcon fontSize="small" />
                  <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 500 }}>
                    +{growthPercentage}% last 7 days
                  </Typography>
                </Box>
              </Box>

              {/* Правая часть (гистограмма) */}
              <Box sx={{ width: 80, height: 40, display: "flex", alignItems: "center" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis hide />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      content={({ active, payload }) =>
                        active && payload && payload.length ? (
                          <Box sx={{ background: "#fff", p: 1, borderRadius: 1, boxShadow: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                              {payload[0].value}
                            </Typography>
                          </Box>
                        ) : null
                      }
                    />
                    <Bar
                      dataKey="count"
                      fill="#7B61FF"
                      radius={[5, 5, 0, 0]}
                      barSize={8}
                      minPointSize={2}
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
