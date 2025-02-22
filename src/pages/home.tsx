// src/pages/home.tsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import PeopleIcon from "@mui/icons-material/People";
import TimerIcon from "@mui/icons-material/Timer";

const data = [
  { name: "Jan", races: 5 },
  { name: "Feb", races: 8 },
  { name: "Mar", races: 3 },
  { name: "Apr", races: 10 },
  { name: "May", races: 7 },
];

const Home: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, maxWidth: { xs: "100%", md: 1200 }, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard
      </Typography>
      <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
        {/* Total Races Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.1)", borderRadius: 2, p: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48, mr: 2 }}>
                  <SportsMotorsportsIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Total Races
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    52
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Total Participants Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.1)", borderRadius: 2, p: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "secondary.main", width: 48, height: 48, mr: 2 }}>
                  <PeopleIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Total Participants
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    1,340
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Total Laps Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.1)", borderRadius: 2, p: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "success.main", width: 48, height: 48, mr: 2 }}>
                  <TimerIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Total Laps
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    15,230
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Races Over Time Chart */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.1)", borderRadius: 2, p: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Races Over Time
              </Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.6)" />
                    <YAxis stroke="rgba(0, 0, 0, 0.6)" />
                    <Tooltip />
                    <Bar dataKey="races" fill="#7367F0" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
