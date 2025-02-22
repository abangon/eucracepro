// src/pages/settings.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";

const Settings: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [country, setCountry] = useState("");
  const [team, setTeam] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    // Получаем список стран с API
    fetch("https://restcountries.com/v3.1/all")
      .then(response => response.json())
      .then(data => {
        // Извлекаем названия стран и сортируем их
        const countryNames = data.map((item: any) => item.name.common);
        countryNames.sort();
        setCountries(countryNames);
      })
      .catch(error => console.error("Error fetching countries:", error));
  }, []);

  const handleSave = async () => {
    // Сохраняем данные в Firestore, если пользователь авторизован
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(
          doc(db, "users", user.uid),
          { nickname, country, team, youtube, instagram, facebook, tiktok },
          { merge: true }
        );
        console.log("Settings saved successfully");
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    } else {
      console.error("No user is logged in");
    }
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
          <FormControl fullWidth variant="outlined">
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select
              labelId="country-select-label"
              value={country}
              label="Country"
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((countryName) => (
                <MenuItem key={countryName} value={countryName}>
                  {countryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
