import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import { Box, Button, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

interface Participant {
  id: string;
  nickname: string;
  team: string;
  country: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

const RegistrationForm: React.FC<{ raceId: string }> = ({ raceId }) => {
  const [user] = useAuthState(auth);
  const [registeredUser, setRegisteredUser] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (!user) return;

    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);

    const checkRegistration = async () => {
      try {
        const participantSnap = await getDoc(participantRef);
        if (participantSnap.exists()) {
          setRegisteredUser(participantSnap.data() as Participant);
        } else {
          setRegisteredUser(null);
        }
      } catch (error) {
        console.error("Error fetching registration:", error);
      }
    };

    checkRegistration();
  }, [user, raceId]);

  // Live-обновление списка участников
  useEffect(() => {
    const participantsRef = collection(db, `races/${raceId}/participants`);
    const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
      const participantsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Participant),
      }));
      setParticipants(participantsList);
    });

    return () => unsubscribe();
  }, [raceId]);

  const handleRegister = async () => {
    if (!user) return;

    try {
      const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
      const newParticipant: Participant = {
        id: user.uid,
        nickname: user.displayName || "Anonymous",
        team: "Ekolka Racing",
        country: "Czechia",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        youtube: "https://youtube.com",
        tiktok: "",
      };

      await setDoc(participantRef, newParticipant);
      setRegisteredUser(newParticipant);
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const handleCancelRegistration = async () => {
    if (!user) return;

    try {
      const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
      await deleteDoc(participantRef);
      setRegisteredUser(null);
    } catch (error) {
      console.error("Error canceling registration:", error);
    }
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

      {/* Таблица участников */}
      <TableContainer sx={{ borderRadius: 2, overflow: "hidden" }}>
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
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>{participant.nickname}</TableCell>
                <TableCell>{participant.team}</TableCell>
                <TableCell>{participant.country}</TableCell>
                <TableCell><a href={participant.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></TableCell>
                <TableCell><a href={participant.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></TableCell>
                <TableCell><a href={participant.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></TableCell>
                <TableCell>{participant.tiktok || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RegistrationForm;
