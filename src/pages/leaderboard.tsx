import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Grid, TextField } from "@mui/material";
import { listenForLeaderboard, addParticipant, updateParticipant, deleteParticipant } from "../services/leaderboardService";

const Leaderboard: React.FC = () => {
  const [participants, setParticipants] = useState<{ id: string; name: string; race: string; time: number }[]>([]);
  const [editParticipantId, setEditParticipantId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; race: string; time: number }>({ name: "", race: "", time: 0 });

  useEffect(() => {
    // Слушаем изменения в Firestore
    const unsubscribe = listenForLeaderboard(setParticipants);
    return () => unsubscribe();
  }, []);

  const handleEditParticipant = (participant: { id: string; name: string; race: string; time: number }) => {
    setEditParticipantId(participant.id);
    setEditData({ name: participant.name, race: participant.race, time: participant.time });
  };

  const handleSaveParticipant = async () => {
    if (editParticipantId) {
      await updateParticipant(editParticipantId, editData);
      setEditParticipantId(null);
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    await deleteParticipant(id);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Race Leaderboard
      </Typography>
      <Grid container spacing={3}>
        {participants.map((participant) => (
          <Grid item xs={12} sm={6} md={4} key={participant.id}>
            <Paper sx={{ p: 2 }}>
              {editParticipantId === participant.id ? (
                <>
                  <TextField
                    fullWidth
                    label="Name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Race"
                    value={editData.race}
                    onChange={(e) => setEditData({ ...editData, race: e.target.value })}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Time (s)"
                    type="number"
                    value={editData.time}
                    onChange={(e) => setEditData({ ...editData, time: Number(e.target.value) })}
                    sx={{ mb: 1 }}
                  />
                  <Button variant="contained" color="success" onClick={handleSaveParticipant} sx={{ mt: 1 }}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h6">{participant.name}</Typography>
                  <Typography variant="body2">Race: {participant.race}</Typography>
                  <Typography variant="body2">Time: {participant.time} sec</Typography>
                  <Button variant="outlined" color="primary" onClick={() => handleEditParticipant(participant)} sx={{ mt: 1, mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteParticipant(participant.id)} sx={{ mt: 1 }}>
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

export default Leaderboard;
