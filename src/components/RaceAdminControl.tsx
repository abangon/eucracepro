import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
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
} from "@mui/material";

const ADMIN_UID = "ztnWBUkh6dUcXLOH8D5nLBEYm2J2";

interface Participant {
  id: string;
  nickname: string;
  chipNumber?: string;
  raceNumber?: string;
}

interface RaceAdminControlProps {
  raceId: string;
}

const RaceAdminControl: React.FC<RaceAdminControlProps> = ({ raceId }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      const participantsRef = collection(db, "races", raceId, "participants");
      const snapshot = await getDocs(participantsRef);
      const participantList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Participant[];
      setParticipants(participantList);
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    fetchParticipants();
    return () => unsubscribeAuth();
  }, [raceId]);

  const updateParticipant = async (id: string, field: "chipNumber" | "raceNumber", value: string) => {
    const participantRef = doc(db, "races", raceId, "participants", id);
    await updateDoc(participantRef, { [field]: value });
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  if (!user || user.uid !== ADMIN_UID) return null;

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Race Admin Control
      </Typography>
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
                <TableCell>{participant.nickname}</TableCell>
                <TableCell>
                  <TextField
                    value={participant.chipNumber || ""}
                    onChange={(e) => updateParticipant(participant.id, "chipNumber", e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={participant.raceNumber || ""}
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
