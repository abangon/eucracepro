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

  useEffect(() => {
    const fetchParticipants = async () => {
      const participantsRef = collection(db, "races", raceId, "participants");
      const snapshot = await getDocs(participantsRef);
      let participantList: Participant[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.id, // userId = id участника
        ...doc.data(),
      })) as Participant[];

      // Получаем настоящие никнеймы из users/{userId}
      const userPromises = participantList.map(async (participant) => {
        const userRef = doc(db, "users", participant.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          participant.nickname = userSnap.data().nickname; // Настоящий никнейм
        }
      });

      await Promise.all(userPromises);
      setParticipants(participantList);
    };

    const fetchAvailableChips = async () => {
      const telemetryRef = collection(db, "races", raceId, "telemetry");
      const telemetrySnapshot = await getDocs(telemetryRef);
      const chipNumbers = telemetrySnapshot.docs.map((doc) => doc.id);
      setAvailableChips(chipNumbers);
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    fetchParticipants();
    fetchAvailableChips();
    return () => unsubscribeAuth();
  }, [raceId]);

  const updateParticipant = (id: string, field: "chipNumber" | "raceNumber", value: string) => {
    setUpdatedParticipants((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveChanges = async () => {
    const updates = Object.entries(updatedParticipants);
    for (const [id, data] of updates) {
      const participantRef = doc(db, "races", raceId, "participants", id);
      await updateDoc(participantRef, { chipNumber: data.chipNumber, raceNumber: data.raceNumber });
    }
    setUpdatedParticipants({});
  };

  if (!user || user.uid !== ADMIN_UID) return null;

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
    </Paper>
  );
};

export default RaceAdminControl;
