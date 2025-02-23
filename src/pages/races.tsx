import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { collection, getDocs, query, orderBy, setDoc, doc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ReactCountryFlag from "react-country-flag";

interface Race {
  id: string;
  name: string;
  date: string;
  track_name: string;
  country: string;
  status: string; // "Registration", "Active", "Finished"
  participants: string[];
  imageData?: string; // Base64 Data URL
  // race_type хранится в базе, но не отображается
}

const Races: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin form fields
  const [newRaceName, setNewRaceName] = useState("");
  const [newRaceDate, setNewRaceDate] = useState("");
  const [newRaceTrackName, setNewRaceTrackName] = useState("");
  const [newRaceCountry, setNewRaceCountry] = useState("");
  const [newRaceStatus, setNewRaceStatus] = useState("Registration");
  const [newRaceType, setNewRaceType] = useState("Race"); // stored but not displayed
  const [newRaceImage, setNewRaceImage] = useState("");
  const [formMessage, setFormMessage] = useState("");

  // Mapping full country name -> ISO code
  const [countryMap, setCountryMap] = useState<Record<string, string>>({});
  // For dropdown in admin form
  const [countries, setCountries] = useState<string[]>([]);

  // Generate random 4-digit race ID
  const generateRaceId = () => {
    return (Math.floor(Math.random() * 9000) + 1000).toString();
  };

  // Fetch races
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const q = query(collection(db, "races"), orderBy("date", "asc"));
        const snapshot = await getDocs(q);
        const fetched: Race[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Race[];
        setRaces(fetched);
      } catch (error) {
        console.error("Error fetching races:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, []);

  // Load country list + mapping
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();
        const map: Record<string, string> = {};
        const names: string[] = [];

        data.forEach((c: any) => {
          const commonName = c?.name?.common;
          const code = c?.cca2;
          if (commonName && code) {
            map[commonName] = code;
          }
          if (commonName) {
            names.push(commonName);
          }
        });
        names.sort();
        setCountryMap(map);
        setCountries(names);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  // Check if user is admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === "ztnWBUkh6dUcXLOH8D5nLBEYm2J2") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setNewRaceImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Create new race
  const handleCreateRace = async () => {
    if (!newRaceName || !newRaceDate || !newRaceTrackName || !newRaceCountry) {
      setFormMessage("Please fill all fields.");
      return;
    }
    const raceId = generateRaceId();
    const newRaceData = {
      name: newRaceName,
      date: newRaceDate,
      track_name: newRaceTrackName,
      country: newRaceCountry,
      status: newRaceStatus,
      race_type: newRaceType,
      participants: [] as string[],
      ...(newRaceImage && { imageData: newRaceImage }),
    };

    try {
      await setDoc(doc(db, "races", raceId), newRaceData);
      setFormMessage(`Race created with ID: ${raceId}`);
      // Reset form
      setNewRaceName("");
      setNewRaceDate("");
      setNewRaceTrackName("");
      setNewRaceCountry("");
      setNewRaceStatus("Registration");
      setNewRaceType("Race");
      setNewRaceImage("");

      // Refresh list
      const q = query(collection(db, "races"), orderBy("date", "asc"));
      const snapshot = await getDocs(q);
      const fetched: Race[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Race[];
      setRaces(fetched);
    } catch (error: any) {
      console.error("Error creating race:", error);
      setFormMessage("Error creating race: " + error.message);
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Capitalize status
  const capitalizeStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Races
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={2}>
          {races.map((race) => {
            // Convert full country name -> ISO code
            const isoCode = countryMap[race.country] || "";
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={race.id}>
                <Card
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    height: 400, // фиксированная высота карточки
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Race ID chip (top-right) */}
                  <Chip
                    label={race.id}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontWeight: "bold",
                      backgroundColor: "#d287fe",
                      color: "white",
                    }}
                  />
                  {/* CardMedia for image */}
                  {race.imageData ? (
                    <CardMedia
                      component="img"
                      image={race.imageData}
                      alt={race.name}
                      sx={{
                        height: 180,
                        objectFit: "contain",
                        backgroundColor: "#f5f5f5",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 180,
                        backgroundColor: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No Image
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={{ flex: "1 1 auto" }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {race.name}
                    </Typography>
                    {/* Country */}
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      {isoCode ? (
                        <ReactCountryFlag
                          countryCode={isoCode}
                          svg
                          style={{
                            width: "1.2em",
                            height: "1.2em",
                            marginRight: 6,
                          }}
                          title={isoCode}
                        />
                      ) : null}
                      <Typography variant="body2" color="text.secondary">
                        {race.country}
                      </Typography>
                    </Box>
                    {/* Date */}
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(race.date)}
                      </Typography>
                    </Box>
                    {/* Track name with icon */}
                    {race.track_name && (
                      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {race.track_name}
                        </Typography>
                      </Box>
                    )}
                    {/* Status button */}
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Button variant="contained" disabled sx={{ textTransform: "none" }}>
                        {capitalizeStatus(race.status)}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Admin form */}
      {isAdmin && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Create New Race
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: 400,
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Race Name"
              variant="outlined"
              value={newRaceName}
              onChange={(e) => setNewRaceName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Date"
              type="date"
              variant="outlined"
              value={newRaceDate}
              onChange={(e) => setNewRaceDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Track Name"
              variant="outlined"
              value={newRaceTrackName}
              onChange={(e) => setNewRaceTrackName(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel id="country-select-label">Country</InputLabel>
              <Select
                labelId="country-select-label"
                value={newRaceCountry}
                label="Country"
                onChange={(e) => setNewRaceCountry(e.target.value)}
              >
                {countries.map((countryName) => (
                  <MenuItem key={countryName} value={countryName}>
                    {countryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={newRaceStatus}
                label="Status"
                onChange={(e) => setNewRaceStatus(e.target.value)}
              >
                <MenuItem value="Registration">Registration</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Finished">Finished</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="race-type-select-label">Race Type</InputLabel>
              <Select
                labelId="race-type-select-label"
                value={newRaceType}
                label="Race Type"
                onChange={(e) => setNewRaceType(e.target.value)}
              >
                <MenuItem value="Race">Race</MenuItem>
                <MenuItem value="Training">Training</MenuItem>
                <MenuItem value="Camp">Camp</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Upload Race Image:
              </Typography>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </Box>
            <Button variant="contained" onClick={handleCreateRace}>
              Create Race
            </Button>
            {formMessage && (
              <Typography variant="body2" color="text.secondary">
                {formMessage}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Races;
