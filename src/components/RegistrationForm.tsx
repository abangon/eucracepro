import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import {
  Box,
  Button,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
} from "@mui/material";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

// Функции формирования URL соцсетей
const getFacebookUrl = (username: string) => `https://www.facebook.com/${username}`;
const getInstagramUrl = (username: string) => `https://www.instagram.com/${username}`;
const getYoutubeUrl = (username: string) => `https://www.youtube.com/@${username}`;
const getTiktokUrl = (username: string) => `https://www.tiktok.com/@${username}`;

const socialIconStyle = { width: "1.5em", height: "1.5em" };

// ID администратора
const ADMIN_UID = "ztnWBUkh6dUcXLOH8D5nLBEYm2J2";

interface RegistrationFormProps {
  raceId: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ raceId }) => {
  const [user] = useAuthState(auth);
  const [participants, setParticipants] = useState<any[]>([]);
  const [chipAssignments, setChipAssignments] = useState<{ [key: string]: string }>({});
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const isAdmin = user?.uid === ADMIN_UID;

  useEffect(() => {
    const fetchParticipants = async () => {
      const participantsRef = collection(db, `races/${raceId}/participants`);
      const snapshot = await getDocs(participantsRef);
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParticipants(usersList);

      // Загружаем текущие назначения чипов
      const chipData: { [key: string]: string } = {};
      usersList.forEach(p => {
        chipData[p.id] = p.chipNumber || "";
      });
      setChipAssignments(chipData);

      if (user) {
        setIsRegistered(usersList.some(p => p.id === user.uid));
      }
    };

    const fetchChips = async () => {
      const raceRef = doc(db, `races/${raceId}`);
      const raceSnap = await getDoc(raceRef);
      if (raceSnap.exists() && raceSnap.data().telemetry) {
        const chips = Object.keys(raceSnap.data().telemetry);
        setAvailableChips(chips);
      }
    };

    fetchParticipants();
    fetchChips();
  }, [raceId, user]);

  const handleChipChange = (userId: string, chipNumber: string) => {
    setChipAssignments(prev => ({ ...prev, [userId]: chipNumber }));
  };

  const handleSaveChips = async () => {
    if (!isAdmin) return;
    try {
      await Promise.all(
        Object.entries(chipAssignments).map(([userId, chipNumber]) => {
          const participantRef = doc(db, `races/${raceId}/participants/${userId}`);
          return updateDoc(participantRef, { chipNumber });
        })
      );
      alert("Chip Numbers saved successfully!");
    } catch (error) {
      console.error("Error saving chip numbers:", error);
      alert("Failed to save Chip Numbers.");
    }
  };

  const handleRegister = async () => {
    if (!user) return;
    const userRef = doc(db, `users/${user.uid}`);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    const newParticipant = {
      nickname: userData.nickname || user.uid,
      team: userData.team || "",
      country: userData.country || "",
      facebook: userData.facebook || "",
      instagram: userData.instagram || "",
      youtube: userData.youtube || "",
      tiktok: userData.tiktok || "",
    };

    await setDoc(participantRef, newParticipant);
    setIsRegistered(true);

    const updatedSnapshot = await getDocs(collection(db, `races/${raceId}/participants`));
    setParticipants(updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Participants</Typography>
        <Box>
          {isAdmin && (
            <Button variant="contained" color="error" onClick={handleSaveChips} sx={{ mr: 2 }}>
              Save
            </Button>
          )}
          {!user ? (
            <Button variant="contained" color="error" href="/sign-in">
              Please log in to register
            </Button>
          ) : !isRegistered ? (
            <Button variant="contained" color="primary" onClick={handleRegister}>
              Register
            </Button>
          ) : null}
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Nickname</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Team</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Country</strong></TableCell>
              {isAdmin && <TableCell sx={{ textAlign: "center" }}><strong>Chip Number</strong></TableCell>}
              <TableCell sx={{ textAlign: "center" }}><strong>Facebook</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Instagram</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>YouTube</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>TikTok</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map(participant => (
              <TableRow key={participant.id}>
                <TableCell>{participant.nickname || participant.id}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{participant.team || "-"}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{participant.country || "-"}</TableCell>

                {isAdmin && (
                  <TableCell sx={{ textAlign: "center" }}>
                    <Select
                      value={chipAssignments[participant.id] || ""}
                      onChange={(e) => handleChipChange(participant.id, e.target.value)}
                      sx={{ width: "120px" }}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {availableChips.map(chip => (
                        <MenuItem key={chip} value={chip}>{chip}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                )}

                {/* Социальные сети */}
                <TableCell sx={{ textAlign: "center" }}>{participant.facebook || "-"}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{participant.instagram || "-"}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{participant.youtube || "-"}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{participant.tiktok || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RegistrationForm;
