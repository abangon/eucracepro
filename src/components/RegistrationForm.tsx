import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
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

// Константа администратора
const ADMIN_UID = "ztnWBUkh6dUcXLOH8D5nLBEYm2J2";

// Функции генерации URL соцсетей
const getFacebookUrl = (username: string) => `https://www.facebook.com/${username}`;
const getInstagramUrl = (username: string) => `https://www.instagram.com/${username}`;
const getYoutubeUrl = (username: string) => `https://www.youtube.com/@${username}`;
const getTiktokUrl = (username: string) => `https://www.tiktok.com/@${username}`;

const socialIconStyle = { width: "1.5em", height: "1.5em" };

interface RegistrationFormProps {
  raceId: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ raceId }) => {
  const [user] = useAuthState(auth);
  const [registeredUser, setRegisteredUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [chipNumber, setChipNumber] = useState<string>("");
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const isAdmin = user?.uid === ADMIN_UID;

  useEffect(() => {
    if (!user) return;

    // Загружаем актуальные данные пользователя
    const fetchUserData = async () => {
      const userRef = doc(db, `users/${user.uid}`);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };

    // Проверяем регистрацию в гонке
    const checkRegistration = async () => {
      const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
      const participantSnap = await getDoc(participantRef);

      if (participantSnap.exists()) {
        setRegisteredUser(participantSnap.data());
        setChipNumber(participantSnap.data().chipNumber || "");
      }
    };

    // Загружаем доступные чипы из telemetry
    const fetchChips = async () => {
      const raceRef = doc(db, `races/${raceId}`);
      const raceSnap = await getDoc(raceRef);

      if (raceSnap.exists()) {
        const raceData = raceSnap.data();
        if (raceData.telemetry) {
          const chips = Object.keys(raceData.telemetry);
          setAvailableChips(chips);
        }
      }
    };

    fetchUserData();
    checkRegistration();
    fetchChips();
  }, [user, raceId]);

  const handleRegister = async () => {
    if (!user || !userData) return;

    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    const newParticipant = {
      nickname: userData.nickname || user.uid,
      team: userData.team || "Unknown Team",
      country: userData.country || "Unknown",
      facebook: userData.facebook || "",
      instagram: userData.instagram || "",
      youtube: userData.youtube || "",
      tiktok: userData.tiktok || "",
      chipNumber,
    };

    await setDoc(participantRef, newParticipant);
    setRegisteredUser(newParticipant);
  };

  const handleCancelRegistration = async () => {
    if (!user) return;

    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    await deleteDoc(participantRef);
    setRegisteredUser(null);
    setChipNumber("");
  };

  const handleSaveChipNumber = async () => {
    if (!user || !isAdmin || !registeredUser) return;

    const participantRef = doc(db, `races/${raceId}/participants/${registeredUser.uid}`);
    await updateDoc(participantRef, { chipNumber });
    setRegisteredUser({ ...registeredUser, chipNumber });
  };

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Participants</Typography>
        <Box>
          {isAdmin && registeredUser && (
            <Button variant="contained" color="secondary" onClick={handleSaveChipNumber} sx={{ mr: 2 }}>
              Save
            </Button>
          )}
          {user ? (
            registeredUser ? (
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
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ textAlign: "left" }}><strong>Nickname</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Team</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Country</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Chip Number</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Facebook</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Instagram</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>YouTube</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>TikTok</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registeredUser && (
              <TableRow>
                <TableCell sx={{ textAlign: "left" }}>{registeredUser.nickname || registeredUser.uid}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{registeredUser.team || "-"}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{registeredUser.country || "-"}</TableCell>

                <TableCell sx={{ textAlign: "center" }}>
                  {isAdmin ? (
                    <Select value={chipNumber} onChange={(e) => setChipNumber(e.target.value)} size="small">
                      {availableChips.map((chip) => (
                        <MenuItem key={chip} value={chip}>{chip}</MenuItem>
                      ))}
                    </Select>
                  ) : (
                    registeredUser.chipNumber || "-"
                  )}
                </TableCell>

              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RegistrationForm;
