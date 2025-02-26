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
  const [chipAssignments, setChipAssignments] = useState<Record<string, string>>({});
  const [user, setUser] = useState<any>(null);
  const [updatedParticipants, setUpdatedParticipants] = useState<Record<string, Participant>>({});
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" | "warning" | undefined } | null>(null);

  useEffect(() => {
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

    const fetchChipAssignments = async () => {
      const telemetryRef = collection(db, "races", raceId, "telemetry");
      const telemetrySnapshot = await getDocs(telemetryRef);
      let chips: Record<string, string> = {};
      telemetrySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data && data.participantId) {
          chips[data.participantId] = doc.id;
        }
      });
      setChipAssignments(chips);
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    fetchParticipants();
    fetchChipAssignments();
    return () => unsubscribeAuth();
  }, [raceId]);

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
        await updateDoc(participantRef, { chipNumber: data.chipNumber, raceNumber: data.raceNumber });
      }
      setUpdatedParticipants({});
      setNotification({ message: "Changes saved successfully!", type: "success" });
    } catch (error) {
      setNotification({ message: "Error saving changes!", type: "error" });
    }
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
                <TableCell>{chipAssignments[participant.id] || "Not Assigned"}</TableCell>
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
