// src/pages/settings.tsx
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";

const Settings: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [country, setCountry] = useState("");
  const [team, setTeam] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");

  const handleSave = () => {
    // Здесь можно реализовать сохранение данных, например, в Firestore
    console.log("Saved settings:", {
      nickname,
      country,
      team,
      youtube,
      instagram,
      facebook,
      tiktok,
    });
    // Можно добавить уведомление об успешном сохранении
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Settings
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nickname"
            variant="outlined"
            fullWidth
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Country"
            variant="outlined"
            fullWidth
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Team"
            variant="outlined"
            fullWidth
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Social Media Links
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="YouTube"
            variant="outlined"
            fullWidth
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Instagram"
            variant="outlined"
            fullWidth
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Facebook"
            variant="outlined"
            fullWidth
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="TikTok"
            variant="outlined"
            fullWidth
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
