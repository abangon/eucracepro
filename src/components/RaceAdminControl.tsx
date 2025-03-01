import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const ADMIN_UID = "ztnWBUkh6dUcXLOH8D5nLBEYm2J2";

interface Participant {
  id: string;
  userId: string;
  nickname?: string;
  chipNumber?: string;
  raceNumber?: string;
}

interface RaceAdminControlProps {
  raceId: string;
}

const RaceAdminControl: React.FC<RaceAdminControlProps> = ({ raceId }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedParticipants, setUpdatedParticipants] = useState<Record<string, Participant>>({});
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" | "warning" | undefined } | null>(null);

  // Проверка авторизации
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoadingAuth(false);
      },
      (err) => {
        console.error("Error in auth state change:", err);
        setError("Failed to authenticate user");
        setLoadingAuth(false);
      }
    );

    return () => unsubscribeAuth();
  }, []);

  // Загрузка данных участников и чипов
  const fetchParticipants = async () => {
    try {
      console.log("Fetching participants...");
      const participantsRef = collection(db, "races", raceId, "participants");
      const snapshot = await getDocs(participantsRef);

      let participantList: Participant[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.id,
        ...doc.data(),
      })) as Participant[];

      const userPromises = participantList.map(async (participant) => {
        const userRef = doc(db, "users", participant.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          participant.nickname = userSnap.data().nickname;
        }
      });

      await Promise.all(userPromises);

      console.log("Loaded participants:", participantList);
      setParticipants(participantList);
    } catch (error) {
      console.error("Error fetching participants:", error);
      setError("Failed to load participants");
    }
  };

  const fetchAvailableChips = async () => {
    try {
      console.log("Fetching available chips...");
      const raceRef = doc(db, "races", raceId);
      const raceSnap = await getDoc(raceRef);

      if (raceSnap.exists()) {
        const raceData = raceSnap.data();
        if (raceData.telemetry) {
          const chipNumbers = Object.keys(raceData.telemetry);
          console.log("Available Chips:", chipNumbers);
          setAvailableChips(chipNumbers);
        } else {
          console.log("No telemetry data found.");
          setAvailableChips([]);
        }
      }
    } catch (error) {
      console.error("Error fetching available chips:", error);
      setError("Failed to load available chips");
    }
  };

  // Выполняем загрузку данных после авторизации
  useEffect(() => {
    const loadData = async () => {
      if (!loadingAuth && user && user.uid === ADMIN_UID) {
        setLoadingData(true);
        try {
          await Promise.all([fetchParticipants(), fetchAvailableChips()]);
        } finally {
          setLoadingData(false);
        }
      }
    };

    loadData();
  }, [raceId, loadingAuth, user]);

  // Обновление данных участника
  const updateParticipant = (id: string, field: "chipNumber" | "raceNumber", value: string) => {
    setUpdatedParticipants((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Сохранение изменений
  const saveChanges = async () => {
    try {
      console.log("Starting saveChanges...");
      const updates = Object.entries(updatedParticipants);
      console.log("Updates to save:", updates);

      for (const [id, data] of updates) {
        console.log("Updating participant:", id, "with data:", data);

        const participantRef = doc(db, "races", raceId, "participants", id);

        let updateData: any = {};
        if (data.chipNumber !== undefined) updateData.chipNumber = data.chipNumber;
        if (data.raceNumber !== undefined) updateData.raceNumber = data.raceNumber;

        console.log("Final update data:", updateData);

        if (Object.keys(updateData).length > 0) {
          await updateDoc(participantRef, updateData);
        }
      }

      setUpdatedParticipants({});
      console.log("Changes saved successfully!");
      setNotification({ message: "Changes saved successfully!", type: "success" });

      fetchParticipants();
    } catch (error) {
      console.error("Error saving changes:", error);
      setNotification({ message: "Error saving changes!", type: "error" });
    }
  };

  // Логика рендеринга
  if (loadingAuth) {
    return null; // Не рендерим ничего во время проверки авторизации
  }

  // Если пользователь не авторизован или не является администратором, ничего не показываем
  if (!user || user.uid !== ADMIN_UID) {
    return null;
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (loadingData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Loading race admin data...</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Race Admin Control
        </Typography>
        <Button variant="contained" color="primary" onClick={saveChanges}>
          Save
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nickname</strong></TableCell>
              <TableCell><strong>Chip Number</strong></TableCell>
              <TableCell><strong>Race Number</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.length > 0 ? (
              participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.nickname || "Unknown"}</TableCell>
                  <TableCell>
                    <Select
                      value={updatedParticipants[participant.id]?.chipNumber || participant.chipNumber || ""}
                      onChange={(e) => updateParticipant(participant.id, "chipNumber", e.target.value)}
                      displayEmpty
                      variant="outlined"
                      size="small"
                    >
                      {availableChips.map((chip) => (
                        <MenuItem key={chip} value={chip}>{chip}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={updatedParticipants[participant.id]?.raceNumber || participant.raceNumber || ""}
                      onChange={(e) => updateParticipant(participant.id, "raceNumber", e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No participants found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={!!notification} autoHideDuration={3000} onClose={() => setNotification(null)}>
        <Alert onClose={() => setNotification(null)} severity={notification?.type} sx={{ width: "100%" }}>
          {notification?.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RaceAdminControl;
