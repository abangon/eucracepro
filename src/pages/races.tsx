import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField } from '@mui/material';
import { listenForRaces, updateRace, deleteRace } from '../services/racesService';

const Races: React.FC = () => {
  const [races, setRaces] = useState<{ id: string; name: string; location: string; date: string }[]>([]);
  const [editRaceId, setEditRaceId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; location: string; date: string }>({ name: '', location: '', date: '' });

  useEffect(() => {
    // Подключаем слушатель изменений Firestore
    const unsubscribe = listenForRaces(setRaces);
    return () => unsubscribe(); // Отписываемся при уходе со страницы
  }, []);

  const handleEditRace = (race: { id: string; name: string; location: string; date: string }) => {
    setEditRaceId(race.id);
    setEditData({ name: race.name, location: race.location, date: race.date });
  };

  const handleSaveRace = async () => {
    if (editRaceId) {
      await updateRace(editRaceId, editData);
      setEditRaceId(null);
    }
  };

  const handleDeleteRace = async (id: string) => {
    await deleteRace(id);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Races
      </Typography>
      <Grid container spacing={3}>
        {races.map((race) => (
          <Grid item xs={12} sm={6} md={4} key={race.id}>
            <Paper sx={{ p: 2 }}>
              {editRaceId === race.id ? (
                <>
                  <TextField
                    fullWidth
                    label="Race Name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Location"
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={editData.date}
                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    sx={{ mb: 1 }}
                  />
                  <Button variant="contained" color="success" onClick={handleSaveRace} sx={{ mt: 1 }}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h6">{race.name}</Typography>
                  <Typography variant="body2">{race.location}</Typography>
                  <Typography variant="body2">{race.date}</Typography>
                  <Button variant="outlined" color="primary" onClick={() => handleEditRace(race)} sx={{ mt: 1, mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteRace(race.id)} sx={{ mt: 1 }}>
                    Delete
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Races;
