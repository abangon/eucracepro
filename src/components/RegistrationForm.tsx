import React from "react";
import { Button, Box, Typography, Paper } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";

const RegistrationForm: React.FC<{ raceId: string }> = ({ raceId }) => {
  const [user] = useAuthState(auth);

  const handleRegister = async () => {
    if (!user) return;
    const userRef = doc(db, `races/${raceId}/participants`, user.uid);
    await setDoc(userRef, {
      nickname: user.displayName || "Unknown",
      team: "Ekolka Racing",
      country: "Czechia",
      facebook: "Facebook",
      instagram: "Instagram",
      youtube: "YouTube",
      tiktok: "-",
    });
  };

  const handleCancel = async () => {
    if (!user) return;
    const userRef = doc(db, `races/${raceId}/participants`, user.uid);
    await deleteDoc(userRef);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Participants
        </Typography>
        {user ? (
          <Button variant="contained" color="error" onClick={handleCancel}>
            Cancel Registration
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleRegister}>
            Register
          </Button>
        )}
      </Box>

      {/* Здесь вставлена таблица, аналогичная leaderboard */}
    </Paper>
  );
};

export default RegistrationForm;
