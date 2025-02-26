// src/components/RaceAdminControl.tsx
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
  onUpdate: () => void; // 🔄 Новый пропс для обновления LapTimesTable.tsx
}

const RaceAdminControl: React.FC<RaceAdminControlProps> = ({ raceId, onUpdate }) => {
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

  const fetchParticipants = async () => {
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
    setParticipants(participantList);
  };

  const saveChanges = async () => {
    try {
      console.log("Saving changes...");
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

      fetchParticipants(); // 🔄 Обновляем участников
      onUpdate(); // 🔄 Обновляем таблицу LapTimesTable.tsx
    } catch (error) {
      console.error("Error saving changes:", error);
      setNotification({ message: "Error saving changes!", type: "error" });
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
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
              <TableCell>Nickname</TableCell>
              <TableCell>Chip Number</TableCell>
              <TableCell>Race Number</TableCell>
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
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RaceAdminControl;
