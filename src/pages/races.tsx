import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Grid } from '@mui/material';
import { listenForRaces, updateRace, deleteRace } from '../services/racesService';

const Races: React.FC = () => {
  const [races, setRaces] = useState<{ id: string; name: string; location: string; date: string }[]>([]);

  useEffect(() => {
    // Подключаем live-обновление
    const unsubscribe = listenForRaces(setRaces);
    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🏁 Upcoming Races
      </Typography>
      <Grid container spacing={3}>
        {races.map((race) => (
          <Grid item xs={12} sm={6} md={4} key={race.id}>
            <Card sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" color="primary">{race.name}</Typography>
                <Typography variant="body2">📍 {race.location}</Typography>
                <Typography variant="body2">📅 {race.date}</Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" size="small" color="primary">
                  View Details
                </Button>
                <Button variant="outlined" size="small" color="error" onClick={() => deleteRace(race.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Races;
