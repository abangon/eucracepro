import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { doc, getDoc, setDoc, collection, addDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface Participant {
  id: string;
  nickname: string;
  country: string;
  team: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

interface RegistrationFormProps {
  raceId: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ raceId }) => {
  const [user] = useAuthState(auth);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!raceId) return;

    const participantsRef = collection(db, "races", raceId, "participants");

    const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Participant[];

      setParticipants(data);
    });

    return () => unsubscribe();
  }, [raceId]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User data not found.");
        return;
      }

      const userData = userSnap.data() as Participant;

      const participantRef = doc(db, "races", raceId, "participants", user.uid);
      await setDoc(participantRef, {
        nickname: userData.nickname || "Unknown",
        country: userData.country || "Unknown",
        team: userData.team || "Unknown",
        facebook: userData.facebook || "",
        instagram: userData.instagram || "",
        youtube: userData.youtube || "",
        tiktok: userData.tiktok || "",
      });

      console.log("User registered successfully!");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Participants
      </Typography>

      {user ? (
        <Button variant="contained" color="primary" onClick={handleRegister} sx={{ mb: 2 }}>
          Register
        </Button>
      ) : (
        <Button variant="contained" color="secondary" onClick={() => navigate("/sign-in")} sx={{ mb: 2 }}>
          Please log in to register
        </Button>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Nickname</strong></TableCell>
              <TableCell><strong>Team</strong></TableCell>
              <TableCell><strong>Country</strong></TableCell>
              <TableCell><strong>Facebook</strong></TableCell>
              <TableCell><strong>Instagram</strong></TableCell>
              <TableCell><strong>Youtube</strong></TableCell>
              <TableCell><strong>Tiktok</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id} sx={{ borderBottom: "1px solid #eee" }}>
                <TableCell>{participant.nickname}</TableCell>
                <TableCell>{participant.team}</TableCell>
                <TableCell>{participant.country}</TableCell>
                <TableCell>
                  {participant.facebook && (
                    <a href={`https://www.facebook.com/${participant.facebook}`} target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {participant.instagram && (
                    <a href={`https://www.instagram.com/${participant.instagram}`} target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {participant.youtube && (
                    <a href={`https://www.youtube.com/@${participant.youtube}`} target="_blank" rel="noopener noreferrer">
                      YouTube
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {participant.tiktok && (
                    <a href={`https://www.tiktok.com/@${participant.tiktok}`} target="_blank" rel="noopener noreferrer">
                      TikTok
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RegistrationForm;
