import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { listenForLeaderboard } from "../services/leaderboardService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Leaderboard: React.FC = () => {
  const [participants, setParticipants] = useState<{ id: string; name: string; race: string; time: number }[]>([]);

  useEffect(() => {
    const unsubscribe = listenForLeaderboard(setParticipants);
    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🏆 Race Leaderboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Race Results</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={participants}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="#3f51b5" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Top Participants</Typography>
            {participants.map((p) => (
              <Box key={p.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>{p.name}</Typography>
                <Typography>{p.time} sec</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Leaderboard;
