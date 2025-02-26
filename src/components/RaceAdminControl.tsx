import React, { useEffect, useState, useCallback } from "react";
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
  const [updatedParticipants, setUpdatedParticipants] = useState<Record<string, Participant>>({});
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" | "warning" | undefined } | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  const fetchAvailableChips = async () => {
    const raceRef = doc(db, "races", raceId);
    const raceSnap = await getDoc(raceRef);
  
    if (raceSnap.exists()) {
      const raceData = raceSnap.data();
      if (raceData.telemetry) {
        const chipNumbers = Object.keys(raceData.telemetry);
        setAvailableChips(chipNumbers);
      } else {
        setAvailableChips([]);
      }
    }
  };

  useEffect(() => {
    fetchAvailableChips();
  }, [raceId]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }
  if (user.uid !== ADMIN_UID) {
    return <Typography>Access Denied</Typography>;
  }

  const updateParticipant = (id: string, field: "chipNumber" | "raceNumber", value: string) => {
    setUpdatedParticipants((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveChanges = async () => {
    try {
        const updates = Object.entries(updatedParticipants);

        for (const [id, data] of updates) {
            const participantRef = doc(db, "races", raceId, "participants", id);

            let updateData: any = {};
            if (data.chipNumber !== undefined) updateData.chipNumber = data.chipNumber;
            if (data.raceNumber !== undefined) updateData.raceNumber = data.raceNumber;

            if (Object.keys(updateData).length > 0) {
                await updateDoc(participantRef, updateData);
            }
        }

        setUpdatedParticipants({});
        setNotification({ message: "Changes saved successfully!", type: "success" });
    } catch (error) {
        setNotification({ message: "Error saving changes!", type: "error" });
    }
  };

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
            {participants.map((participant) => (
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
            ))}
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
