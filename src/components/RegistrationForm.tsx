import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
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

interface RegistrationFormProps {
  raceId: string;
}

const ADMIN_UID = "ztnWBUkh6dUcXLOH8D5nLBEYm2J2";

const RegistrationForm: React.FC<RegistrationFormProps> = ({ raceId }) => {
  const [user] = useAuthState(auth);
  const [participants, setParticipants] = useState<any[]>([]);
  const [userData, setUserData] = useState<any | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const [selectedChips, setSelectedChips] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Загружаем всех участников гонки
    const fetchParticipants = async () => {
      const participantsRef = collection(db, `races/${raceId}/participants`);
      const snapshot = await getDocs(participantsRef);
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParticipants(usersList);

      if (user) {
        setIsRegistered(usersList.some(p => p.id === user.uid));
      }
    };

    // Загружаем актуальные данные пользователя
    const fetchUserData = async () => {
      if (!user) return;
      const userRef = doc(db, `users/${user.uid}`);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };

    // Загружаем доступные номера чипов из telemetry
    const fetchChipNumbers = async () => {
      const raceRef = doc(db, `races/${raceId}`);
      const raceSnap = await getDoc(raceRef);

      if (raceSnap.exists() && raceSnap.data().telemetry) {
        const chipNumbers = Object.keys(raceSnap.data().telemetry);
        setAvailableChips(chipNumbers);
      }
    };

    fetchParticipants();
    fetchUserData();
    fetchChipNumbers();
  }, [user, raceId]);

  const handleRegister = async () => {
    if (!user || !userData) return;

    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    const newParticipant = {
      nickname: userData.nickname || user.uid,
      team: userData.team || "",
      country: userData.country || "",
      facebook: userData.facebook || "",
      instagram: userData.instagram || "",
      youtube: userData.youtube || "",
      tiktok: userData.tiktok || "",
      chipNumber: "",
    };

    await setDoc(participantRef, newParticipant);
    setIsRegistered(true);

    const updatedSnapshot = await getDocs(collection(db, `races/${raceId}/participants`));
    setParticipants(updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleCancelRegistration = async () => {
    if (!user) return;

    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    await deleteDoc(participantRef);
    setIsRegistered(false);

    const updatedSnapshot = await getDocs(collection(db, `races/${raceId}/participants`));
    setParticipants(updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleChipChange = (userId: string, chipNumber: string) => {
    setSelectedChips(prev => ({ ...prev, [userId]: chipNumber }));
  };

  const handleSaveChips = async () => {
    if (!user || user.uid !== ADMIN_UID) return;

    const updates = Object.entries(selectedChips).map(async ([userId, chipNumber]) => {
      const participantRef = doc(db, `races/${raceId}/participants/${userId}`);
      await setDoc(participantRef, { chipNumber }, { merge: true });
    });

    await Promise.all(updates);
    alert("Chip numbers saved!");
  };

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Participants</Typography>
        {user?.uid === ADMIN_UID && (
          <Button variant="contained" color="secondary" onClick={handleSaveChips}>
            Save
          </Button>
        )}
        {user ? (
          isRegistered ? (
            <Button variant="contained" color="error" onClick={handleCancelRegistration}>
              Cancel Registration
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleRegister}>
              Register
            </Button>
          )
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
              <TableCell><strong>Team</strong></TableCell>
              <TableCell><strong>Country</strong></TableCell>
              {user?.uid === ADMIN_UID && <TableCell><strong>Chip Number</strong></TableCell>}
              <TableCell><strong>Facebook</strong></TableCell>
              <TableCell><strong>Instagram</strong></TableCell>
              <TableCell><strong>YouTube</strong></TableCell>
              <TableCell><strong>TikTok</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map(participant => (
              <TableRow key={participant.id}>
                <TableCell>{participant.nickname || participant.id}</TableCell>
                <TableCell>{participant.team || "-"}</TableCell>
                <TableCell>{participant.country || "-"}</TableCell>
                {user?.uid === ADMIN_UID && (
                  <TableCell>
                    <Select
                      value={selectedChips[participant.id] || participant.chipNumber || ""}
                      onChange={(e) => handleChipChange(participant.id, e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">None</MenuItem>
                      {availableChips.map(chip => (
                        <MenuItem key={chip} value={chip}>{chip}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RegistrationForm;
