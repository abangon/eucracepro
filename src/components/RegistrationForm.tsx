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
  const [participants, setParticipants] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<{ [key: string]: any }>({});
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchParticipants = async () => {
      const participantsRef = collection(db, `races/${raceId}/participants`);
      const snapshot = await getDocs(participantsRef);
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParticipants(usersList);

      if (user) {
        setIsRegistered(usersList.some(p => p.id === user.uid));
      }

      // Загрузка данных всех пользователей
      const usersRef = collection(db, "users");
      const usersSnap = await getDocs(usersRef);
      const usersMap: { [key: string]: any } = {};
      usersSnap.docs.forEach((doc) => {
        usersMap[doc.id] = doc.data();
      });

      setUsersData(usersMap);
    };

    fetchParticipants();
  }, [user, raceId]);

  const handleRegister = async () => {
    if (!user) return;

    const userInfo = usersData[user.uid] || {};
    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    const newParticipant = {
      nickname: userInfo.nickname || user.uid,
      team: userInfo.team || "-",
      country: userInfo.country || "-",
      facebook: userInfo.facebook || "",
      instagram: userInfo.instagram || "",
      youtube: userInfo.youtube || "",
      tiktok: userInfo.tiktok || "",
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
              Register to the race
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
              <TableCell sx={{ textAlign: "center" }}><strong>Team</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Country</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Facebook</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Instagram</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>YouTube</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>TikTok</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map(participant => {
              const userInfo = usersData[participant.id] || {}; // Данные из users
              return (
                <TableRow key={participant.id}>
                  <TableCell>{userInfo.nickname || participant.nickname || participant.id}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{userInfo.team || participant.team || "-"}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{userInfo.country || participant.country || "-"}</TableCell>

                  {/* Facebook */}
                  <TableCell sx={{ textAlign: "center" }}>
                    {userInfo.facebook || participant.facebook ? (
                      <a href={getFacebookUrl(userInfo.facebook || participant.facebook)} target="_blank" rel="noopener noreferrer">
                        <FaFacebook style={{ ...socialIconStyle, color: "#1877F2" }} />
                      </a>
                    ) : "-"}
                  </TableCell>

                  {/* Instagram */}
                  <TableCell sx={{ textAlign: "center" }}>
                    {userInfo.instagram || participant.instagram ? (
                      <a href={getInstagramUrl(userInfo.instagram || participant.instagram)} target="_blank" rel="noopener noreferrer">
                        <FaInstagram style={{ ...socialIconStyle, color: "#E1306C" }} />
                      </a>
                    ) : "-"}
                  </TableCell>

                  {/* YouTube */}
                  <TableCell sx={{ textAlign: "center" }}>
                    {userInfo.youtube || participant.youtube ? (
                      <a href={getYoutubeUrl(userInfo.youtube || participant.youtube)} target="_blank" rel="noopener noreferrer">
                        <FaYoutube style={{ ...socialIconStyle, color: "#FF0000" }} />
                      </a>
                    ) : "-"}
                  </TableCell>

                  {/* TikTok */}
                  <TableCell sx={{ textAlign: "center" }}>
                    {userInfo.tiktok || participant.tiktok ? (
                      <a href={getTiktokUrl(userInfo.tiktok || participant.tiktok)} target="_blank" rel="noopener noreferrer">
                        <FaTiktok style={{ ...socialIconStyle, color: "#000000" }} />
                      </a>
                    ) : "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RegistrationForm;
