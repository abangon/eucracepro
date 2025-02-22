import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { getRaces, addRace } from '../services/racesService';

const Races: React.FC = () => {
  const [races, setRaces] = useState<{ id: string; name: string; location: string; date: string }[]>([]);

  useEffect(() => {
    const fetchRaces = async () => {
      const data = await getRaces();
      setRaces(data);
    };

    fetchRaces();
  }, []);

  const handleAddRace = async () => {
    const newRace = { name: "New Race", location: "Berlin", date: "2024-06-30" };
    await addRace(newRace);
    setRaces(await getRaces()); // Перезагружаем список
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Races
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddRace} sx={{ mb: 2 }}>
        Add New Race (Test)
      </Button>
      <Grid container spacing={3}>
        {races.map((race) => (
          <Grid item xs={12} sm={6} md={4} key={race.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{race.name}</Typography>
              <Typography variant="body2">{race.location}</Typography>
              <Typography variant="body2">{race.date}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Races;
