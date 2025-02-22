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
  FormControl,
  Alert,
} from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
  const [error, setError] = useState("");
  const [debugMessage, setDebugMessage] = useState("");

  useEffect(() => {
    // Получаем список стран с публичного API
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((item: any) => item.name.common);
        countryNames.sort();
        setCountries(countryNames);
      })
      .catch((error) => console.error("Error fetching countries:", error));

    // Загружаем данные пользователя из Firestore
    const fetchUserData = async () => {
      const user = auth.currentUser;
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
      }
    };

    fetchUserData();
  }, []);

  const validateSocialMedia = (value: string) => {
    return value === "" || value.startsWith("@");
  };

  const handleSave = async () => {
    setError("");
    setDebugMessage("");

    if (!nickname.trim()) {
      setError("Nickname is required.");
      return;
    }

    if (!validateSocialMedia(youtube)) {
      setError("YouTube channel should start with '@'.");
      return;
    }
    if (!validateSocialMedia(instagram)) {
      setError("Instagram handle should start with '@'.");
      return;
    }
    if (!validateSocialMedia(facebook)) {
      setError("Facebook username should start with '@'.");
      return;
    }
    if (!validateSocialMedia(tiktok)) {
      setError("TikTok handle should start with '@'.");
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
        setDebugMessage("Settings saved successfully.");
      } catch (err: any) {
        setError("Error saving settings: " + err.message);
      }
    } else {
      setError("No user is logged in.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Settings
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {debugMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {debugMessage}
        </Alert>
      )}
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
          <Typography variant="h6" gutterBottom>
            Social Media Links
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="YouTube"
            variant="outlined"
            fullWidth
            placeholder="@YourYouTubeChannel"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Instagram"
            variant="outlined"
            fullWidth
            placeholder="@YourInstagramHandle"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Facebook"
            variant="outlined"
            fullWidth
            placeholder="@YourFacebookUsername"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="TikTok"
            variant="outlined"
            fullWidth
            placeholder="@YourTikTokHandle"
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
