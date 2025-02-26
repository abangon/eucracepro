import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
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
const getInstagramUrl = (username: string) => `https://www.instagram.com/${username.startsWith("@") ? username : "@" + username}`;
const getYoutubeUrl = (username: string) => `https://www.youtube.com/@${username.startsWith("@") ? username.slice(1) : username}`;
const getTiktokUrl = (username: string) => `https://www.tiktok.com/@${username.startsWith("@") ? username : "@" + username}`;

// Стили иконок
const socialIconStyle = { width: "1.5em", height: "1.5em" };
const facebookColor = "#1877F2";
const instagramColor = "#E1306C";
const youtubeColor = "#FF0000";
const tiktokColor = "#000000";

interface RegistrationFormProps {
  raceId: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ raceId }) => {
  const [user] = useAuthState(auth);
  const [registeredUser, setRegisteredUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;

    // Загружаем актуальные данные пользователя из Firestore
    const fetchUserData = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };

    // Проверяем регистрацию пользователя в гонке
    const checkRegistration = async () => {
      const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
      const participantSnap = await getDoc(participantRef);

      if (participantSnap.exists()) {
        setRegisteredUser(participantSnap.data());
      }
    };

    fetchUserData();
    checkRegistration();
  }, [user, raceId]);

  const handleRegister = async () => {
    if (!user || !userData) return;

    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    const newParticipant = {
      nickname: userData.nickname || "Anonymous",
      team: userData.team || "-",
      country: userData.country || "-",
      facebook: userData.facebook || "",
      instagram: userData.instagram || "",
      youtube: userData.youtube || "",
      tiktok: userData.tiktok || "",
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
        <Typography variant="h6" fontWeight="bold">
          Participants
        </Typography>
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

      {/* Таблица участников */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Nickname</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Team</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Country</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Facebook</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Instagram</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>YouTube</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>TikTok</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registeredUser && (
              <TableRow>
                <TableCell>{registeredUser.nickname}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{registeredUser.team}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{registeredUser.country}</TableCell>

                {/* Facebook */}
                <TableCell sx={{ textAlign: "center" }}>
                  {registeredUser.facebook ? (
                    <a
                      href={getFacebookUrl(registeredUser.facebook)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook style={{ ...socialIconStyle, color: facebookColor }} />
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* Instagram */}
                <TableCell sx={{ textAlign: "center" }}>
                  {registeredUser.instagram ? (
                    <a
                      href={getInstagramUrl(registeredUser.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram style={{ ...socialIconStyle, color: instagramColor }} />
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* YouTube */}
                <TableCell sx={{ textAlign: "center" }}>
                  {registeredUser.youtube ? (
                    <a
                      href={getYoutubeUrl(registeredUser.youtube)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaYoutube style={{ ...socialIconStyle, color: youtubeColor }} />
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* TikTok */}
                <TableCell sx={{ textAlign: "center" }}>
                  {registeredUser.tiktok ? (
                    <a
                      href={getTiktokUrl(registeredUser.tiktok)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTiktok style={{ ...socialIconStyle, color: tiktokColor }} />
                    </a>
                  ) : (
                    "-"
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
