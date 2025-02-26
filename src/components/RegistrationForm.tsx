import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import {
  Box, Button, Typography, Paper, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, Select, MenuItem, Snackbar
} from "@mui/material";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

interface RegistrationFormProps {
  raceId: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ raceId }) => {
  const [user] = useAuthState(auth);
  const [participants, setParticipants] = useState<any[]>([]);
  const [chipNumbers, setChipNumbers] = useState<string[]>([]);
  const [selectedChip, setSelectedChip] = useState<{ [key: string]: string }>({});
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const isAdmin = user?.uid === "ztnWBUkh6dUcXLOH8D5nLBEYm2J2"; // Проверка на админа

  useEffect(() => {
    // Загружаем всех участников гонки
    const fetchParticipants = async () => {
      const participantsRef = collection(db, `races/${raceId}/participants`);
      const snapshot = await getDocs(participantsRef);
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParticipants(usersList);

      // Заполняем состояние выбранных чипов
      const chipMapping: { [key: string]: string } = {};
      usersList.forEach(user => {
        if (user.id && user.chipNumber) {
          chipMapping[user.id] = user.chipNumber;
        }
      });
      setSelectedChip(chipMapping);
    };

    // Загружаем список чипов
    const fetchChipNumbers = async () => {
      const raceDocRef = doc(db, "races", raceId);
      const raceDocSnap = await getDoc(raceDocRef);

      if (raceDocSnap.exists() && raceDocSnap.data().telemetry) {
        const telemetry = Object.keys(raceDocSnap.data().telemetry);
        setChipNumbers(telemetry);
      }
    };

    fetchParticipants();
    fetchChipNumbers();
  }, [raceId]);

  const handleRegister = async () => {
    if (!user) return;
    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    const userRef = doc(db, `users/${user.uid}`);

    const newParticipant = {
      nickname: user.displayName || user.uid,
      team: "",
      country: "",
      facebook: "",
      instagram: "",
      youtube: "",
      tiktok: "",
      chipNumber: selectedChip[user.uid] || ""
    };

    await setDoc(participantRef, newParticipant, { merge: true });
    await setDoc(userRef, { chipNumber: selectedChip[user.uid] || "" }, { merge: true });

    setSnackbarMessage("Registered successfully!");
  };

  const handleSaveChip = async (userId: string) => {
    if (!isAdmin) return;

    const participantRef = doc(db, `races/${raceId}/participants/${userId}`);
    const userRef = doc(db, `users/${userId}`);

    try {
      await updateDoc(participantRef, { chipNumber: selectedChip[userId] });
      await updateDoc(userRef, { chipNumber: selectedChip[userId] });
      setSnackbarMessage("Chip number saved!");
    } catch (error) {
      setSnackbarMessage("Failed to save chip number.");
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Participants</Typography>
        {user ? (
          <Button variant="contained" color="primary" onClick={handleRegister}>
            Register
          </Button>
        ) : (
          <Button variant="contained" color="error" href="/sign-in">
            Please log in to register
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Nickname</strong></TableCell>
              <TableCell align="center"><strong>Team</strong></TableCell>
              <TableCell align="center"><strong>Country</strong></TableCell>
              {isAdmin && <TableCell align="center"><strong>Chip Number</strong></TableCell>}
              <TableCell align="center"><strong>Facebook</strong></TableCell>
              <TableCell align="center"><strong>Instagram</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>{participant.nickname || participant.id}</TableCell>
                <TableCell align="center">{participant.team || "-"}</TableCell>
                <TableCell align="center">{participant.country || "-"}</TableCell>

                {isAdmin && (
                  <TableCell align="center">
                    <Select
                      value={selectedChip[participant.id] || ""}
                      onChange={(e) => setSelectedChip({ ...selectedChip, [participant.id]: e.target.value })}
                    >
                      {chipNumbers.map(chip => (
                        <MenuItem key={chip} value={chip}>{chip}</MenuItem>
                      ))}
                    </Select>
                    <Button
                      sx={{ ml: 1 }}
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleSaveChip(participant.id)}
                    >
                      Save
                    </Button>
                  </TableCell>
                )}

                <TableCell align="center">
                  {participant.facebook ? (
                    <a href={`https://www.facebook.com/${participant.facebook}`} target="_blank" rel="noopener noreferrer">
                      <FaFacebook style={{ color: "#1877F2" }} />
                    </a>
                  ) : "-"}
                </TableCell>

                <TableCell align="center">
                  {participant.instagram ? (
                    <a href={`https://www.instagram.com/${participant.instagram}`} target="_blank" rel="noopener noreferrer">
                      <FaInstagram style={{ color: "#E1306C" }} />
                    </a>
                  ) : "-"}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {snackbarMessage && <Snackbar open autoHideDuration={3000} message={snackbarMessage} />}
    </Paper>
  );
};

export default RegistrationForm;
