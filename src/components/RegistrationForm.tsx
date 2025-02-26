import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import { Box, Button, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

interface RegistrationFormProps {
  raceId: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ raceId }) => {
  const [user] = useAuthState(auth);
  const [registeredUser, setRegisteredUser] = useState<any | null>(null);
  
  useEffect(() => {
    if (!user) return;

    const checkRegistration = async () => {
      const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
      const participantSnap = await getDoc(participantRef);

      if (participantSnap.exists()) {
        setRegisteredUser(participantSnap.data());
      }
    };

    checkRegistration();
  }, [user, raceId]);

  const handleRegister = async () => {
    if (!user) return;

    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    const newParticipant = {
      nickname: user.displayName || "Anonymous",
      team: "Ekolka Racing", // Можно расширить, если добавится настройка команды
      country: "Czechia", // Данные можно получать из профиля
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      tiktok: "",
    };

    await setDoc(participantRef, newParticipant);
    setRegisteredUser(newParticipant);
  };

  const handleCancelRegistration = async () => {
    if (!user) return;

    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    await deleteDoc(participantRef);
    setRegisteredUser(null);
  };

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Participants</Typography>
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

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Nickname</strong></TableCell>
              <TableCell><strong>Team</strong></TableCell>
              <TableCell><strong>Country</strong></TableCell>
              <TableCell><strong>Facebook</strong></TableCell>
              <TableCell><strong>Instagram</strong></TableCell>
              <TableCell><strong>YouTube</strong></TableCell>
              <TableCell><strong>TikTok</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registeredUser && (
              <TableRow>
                <TableCell>{registeredUser.nickname}</TableCell>
                <TableCell>{registeredUser.team}</TableCell>
                <TableCell>{registeredUser.country}</TableCell>
                <TableCell><a href={registeredUser.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></TableCell>
                <TableCell><a href={registeredUser.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></TableCell>
                <TableCell><a href={registeredUser.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></TableCell>
                <TableCell>{registeredUser.tiktok || "-"}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RegistrationForm;
