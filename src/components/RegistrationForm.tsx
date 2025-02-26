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

const RegistrationForm: React.FC<RegistrationFormProps> = ({ raceId }) => {
  const [user] = useAuthState(auth);
  const [participants, setParticipants] = useState<any[]>([]); // Хранение всех участников
  const [userData, setUserData] = useState<any | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Загружаем всех участников гонки
    const fetchParticipants = async () => {
      const participantsRef = collection(db, `races/${raceId}/participants`);
      const snapshot = await getDocs(participantsRef);
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParticipants(usersList);

      // Проверяем, зарегистрирован ли текущий пользователь
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

    fetchParticipants();
    fetchUserData();
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
    };

    await setDoc(participantRef, newParticipant);
    setIsRegistered(true);

    // Перезагружаем список участников
    const updatedSnapshot = await getDocs(collection(db, `races/${raceId}/participants`));
    setParticipants(updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleCancelRegistration = async () => {
    if (!user) return;

    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    await deleteDoc(participantRef);
    setIsRegistered(false);

    // Перезагружаем список участников
    const updatedSnapshot = await getDocs(collection(db, `races/${raceId}/participants`));
    setParticipants(updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Participants</Typography>
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
              <TableCell sx={{ textAlign: "left" }}><strong>Nickname</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Team</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Country</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Facebook</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Instagram</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>YouTube</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>TikTok</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell sx={{ textAlign: "left" }}>
                  {participant.nickname || participant.id}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>{participant.team || "-"}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{participant.country || "-"}</TableCell>

                {/* Facebook */}
                <TableCell sx={{ textAlign: "center" }}>
                  {participant.facebook ? (
                    <a href={getFacebookUrl(participant.facebook)} target="_blank" rel="noopener noreferrer">
                      <FaFacebook style={{ ...socialIconStyle, color: "#1877F2" }} />
                    </a>
                  ) : "-"}
                </TableCell>

                {/* Instagram */}
                <TableCell sx={{ textAlign: "center" }}>
                  {participant.instagram ? (
                    <a href={getInstagramUrl(participant.instagram)} target="_blank" rel="noopener noreferrer">
                      <FaInstagram style={{ ...socialIconStyle, color: "#E1306C" }} />
                    </a>
                  ) : "-"}
                </TableCell>

                {/* YouTube */}
                <TableCell sx={{ textAlign: "center" }}>
                  {participant.youtube ? (
                    <a href={getYoutubeUrl(participant.youtube)} target="_blank" rel="noopener noreferrer">
                      <FaYoutube style={{ ...socialIconStyle, color: "#FF0000" }} />
                    </a>
                  ) : "-"}
                </TableCell>

                {/* TikTok */}
                <TableCell sx={{ textAlign: "center" }}>
                  {participant.tiktok ? (
                    <a href={getTiktokUrl(participant.tiktok)} target="_blank" rel="noopener noreferrer">
                      <FaTiktok style={{ ...socialIconStyle, color: "#000000" }} />
                    </a>
                  ) : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RegistrationForm;
