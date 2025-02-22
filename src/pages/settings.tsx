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
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((item: any) => item.name.common);
        countryNames.sort();
        setCountries(countryNames);
      })
      .catch((error) => console.error("Error fetching countries:", error));

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

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        User Settings
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {debugMessage && <Alert severity="success" sx={{ mb: 2 }}>{debugMessage}</Alert>}
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
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
