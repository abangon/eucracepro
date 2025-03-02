// src/pages/Settings.tsx
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
  FormControl,
  Alert,
} from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../utils/firebase";
import { countriesData } from "../data/countries"; // Импортируем список стран

const Settings: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [country, setCountry] = useState("");
  const [team, setTeam] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Загружаем список стран из локального файла
    try {
      const countryNames = countriesData.map((country) => country.name);
      countryNames.sort();
      setCountries(countryNames);
      console.log("Countries loaded successfully in Settings:", countryNames);
    } catch (err) {
      console.error("Error loading countries in Settings:", err);
      setError("Failed to load countries list.");
    }

    // Загружаем данные пользователя после аутентификации
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setNickname(userData.nickname || "");
            setCountry(userData.country || "");
            setTeam(userData.team || "");
            setYoutube(userData.youtube || "");
            setInstagram(userData.instagram || "");
            setFacebook(userData.facebook || "");
            setTiktok(userData.tiktok || "");
          }
        } catch (err: any) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data.");
        }
      } else {
        setError("You are not signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  // Функция сохранения данных
  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

    if (!nickname.trim()) {
      setError("Nickname is required.");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(
          doc(db, "users", user.uid),
          { nickname, country, team, youtube, instagram, facebook, tiktok },
          { merge: true }
        );
        setSuccessMessage("Settings saved successfully!");
      } catch (err: any) {
        setError("Error saving settings: " + err.message);
      }
    } else {
      setError("No user is logged in.");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        User Settings
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nickname"
            variant="outlined"
            fullWidth
            required
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
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Social Media Links
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="YouTube"
            variant="outlined"
            fullWidth
            placeholder="YourYouTubeChannel"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Instagram"
            variant="outlined"
            fullWidth
            placeholder="YourInstagramUsername"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Facebook"
            variant="outlined"
            fullWidth
            placeholder="YourFacebookUsername"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="TikTok"
            variant="outlined"
            fullWidth
            placeholder="YourTikTokUsername"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSave}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
