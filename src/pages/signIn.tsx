// src/pages/signIn.tsx
import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, signInWithGoogle } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to home page after sign in
    } catch (error) {
      console.error("Error signing in with email:", error);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      <Box
        sx={{
          maxWidth: 400,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleEmailSignIn}>
          Sign in with Email
        </Button>
        <Button variant="text" color="primary" onClick={handlePasswordReset}>
          Forgot Password?
        </Button>
        <Typography variant="subtitle1">or</Typography>
        <Button variant="contained" color="secondary" onClick={handleGoogleSignIn}>
          Sign in with Google
        </Button>
      </Box>
    </Box>
  );
};

export default SignIn;
