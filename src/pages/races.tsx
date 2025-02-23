import React, { useState, useEffect } from "react";
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
import { collection, getDocs, query, orderBy, setDoc, doc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Race {
  id: string;
  name: string;
  date: string;
  track_name: string;
  status: string; // "registration", "active", "finished"
  participants: string[];
  // Другие поля не используются в этой форме
}

const Races: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Состояния для админской формы создания гонки
  const [newRaceName, setNewRaceName] = useState("");
  const [newRaceDate, setNewRaceDate] = useState("");
  const [newRaceTrackName, setNewRaceTrackName] = useState("");
  const [newRaceStatus, setNewRaceStatus] = useState("registration");
  const [formMessage, setFormMessage] = useState("");

  // Функция для генерации случайного 4-значного идентификатора гонки
  const generateRaceId = () => {
    return (Math.floor(Math.random() * 9000) + 1000).toString();
  };

  // Получаем список гонок
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

  // Проверяем, авторизован ли пользователь как администратор
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

  // Функция создания гонки
  const handleCreateRace = async () => {
    if (!newRaceName.trim() || !newRaceDate.trim() || !newRaceTrackName.trim()) {
      setFormMessage("Please fill all fields.");
      return;
    }
    // Генерируем 4-значный идентификатор гонки
    const raceId = generateRaceId();

    // Формируем объект новой гонки
    const newRace: Partial<Race> = {
      name: newRaceName,
      date: newRaceDate,
      track_name: newRaceTrackName,
      status: newRaceStatus,
      participants: [],
    };

    try {
      await setDoc(doc(db, "races", raceId), newRace);
      setFormMessage(`Race created with ID: ${raceId}`);
      // Очистка полей формы
      setNewRaceName("");
      setNewRaceDate("");
      setNewRaceTrackName("");
      setNewRaceStatus("registration");
      // Обновляем список гонок
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
              <Card sx={{ width: "100%", borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6">{race.name}</Typography>
                  {race.date && (
                    <Typography variant="body2" color="text.secondary">
                      {race.date} {race.track_name && `- ${race.track_name}`}
                    </Typography>
                  )}
                  {race.status && (
                    <Typography variant="body2" color="text.secondary">
                      Status: {race.status}
                    </Typography>
                  )}
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
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={newRaceStatus}
                label="Status"
                onChange={(e) => setNewRaceStatus(e.target.value)}
              >
                <MenuItem value="registration">registration</MenuItem>
                <MenuItem value="active">active</MenuItem>
                <MenuItem value="finished">finished</MenuItem>
              </Select>
            </FormControl>
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
