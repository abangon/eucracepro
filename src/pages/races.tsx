import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  collection,
  getDocs,
  query,
  orderBy,
  setDoc,
  doc,
} from "firebase/firestore";
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
  // race_type удалено для отображения
  participants: string[];
  imageData?: string; // Optional image as Data URL
}

const Races: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Admin form states
  const [newRaceName, setNewRaceName] = useState("");
  const [newRaceDate, setNewRaceDate] = useState("");
  const [newRaceTrackName, setNewRaceTrackName] = useState("");
  const [newRaceCountry, setNewRaceCountry] = useState("");
  const [newRaceStatus, setNewRaceStatus] = useState("Registration");
  const [newRaceType, setNewRaceType] = useState("Race"); // Всё ещё сохраняется в базе, но не отображается
  const [newRaceImage, setNewRaceImage] = useState<string>("");
  const [formMessage, setFormMessage] = useState("");

  // List of countries for admin form
  const [countries, setCountries] = useState<string[]>([]);

  // Function to generate a random 4-digit race ID as string
  const generateRaceId = () => {
    return (Math.floor(Math.random() * 9000) + 1000).toString();
  };

  // Fetch races list from Firestore
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const q = query(collection(db, "races"), orderBy("date", "asc"));
        const snapshot = await getDocs(q);
        const fetchedRaces: Race[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Race[];
        setRaces(fetchedRaces);
      } catch (error) {
        console.error("Error fetching races:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  // Load list of countries (аналогично странице Settings)
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryNames = data.map((item: any) => item.name.common);
        countryNames.sort();
        setCountries(countryNames);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Check if the user is admin (только UID "ztnWBUkh6dUcXLOH8D5nLBEYm2J2" может создавать гонки)
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

  // Обработка выбора файла для изображения гонки
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          setNewRaceImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Функция создания новой гонки
  const handleCreateRace = async () => {
    if (
      !newRaceName.trim() ||
      !newRaceDate.trim() ||
      !newRaceTrackName.trim() ||
      !newRaceCountry.trim()
    ) {
      setFormMessage("Please fill all fields.");
      return;
    }
    const raceId = generateRaceId();
    const newRace: Partial<Race> = {
      name: newRaceName,
      date: newRaceDate,
      track_name: newRaceTrackName,
      country: newRaceCountry,
      status: newRaceStatus,
      race_type: newRaceType,
      participants: [],
      ...(newRaceImage && { imageData: newRaceImage }),
    };

    try {
      await setDoc(doc(db, "races", raceId), newRace);
      setFormMessage(`Race created with ID: ${raceId}`);
      // Clear form fields
      setNewRaceName("");
      setNewRaceDate("");
      setNewRaceTrackName("");
      setNewRaceCountry("");
      setNewRaceStatus("Registration");
      setNewRaceType("Race");
      setNewRaceImage("");
      // Refresh the list of races
      const q = query(collection(db, "races"), orderBy("date", "asc"));
      const snapshot = await getDocs(q);
      const fetchedRaces: Race[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Race[];
      setRaces(fetchedRaces);
    } catch (error: any) {
      console.error("Error creating race:", error);
      setFormMessage("Error creating race: " + error.message);
    }
  };

  // Helper function to format date in English
  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to capitalize status
  const capitalizeStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Races
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : races.length > 0 ? (
        <List>
          {races.map((race) => (
            <ListItem key={race.id} sx={{ mb: 2 }}>
              <Card
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {race.imageData && (
                  <Box>
                    <img
                      src={race.imageData}
                      alt={race.name}
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
                {/* Race ID для администратора */}
                {isAdmin && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      px: 1,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                    }}
                  >
                    ID: {race.id}
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h6">{race.name}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    {/* Флаг страны */}
                    <ReactCountryFlag
                      countryCode={race.country} // Предполагаем, что в базе хранится ISO-код; если нет – можно реализовать маппинг
                      svg
                      style={{ width: "1.5em", height: "1.5em", marginRight: 4 }}
                      title={race.country}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {race.country}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(race.date)}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" disabled sx={{ textTransform: "none" }}>
                      {capitalizeStatus(race.status)}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No upcoming races.</Typography>
      )}

      {/* Админская форма для создания новой гонки */}
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
