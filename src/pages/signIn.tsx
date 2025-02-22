// src/pages/signIn.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, signInWithGoogle } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleEmailSignIn = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message.replace(/Firebase:\s*/gi, ""));
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message.replace(/Firebase:\s*/gi, ""));
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err: any) {
      setError(err.message.replace(/Firebase:\s*/gi, ""));
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: "center", maxWidth: 400, mx: "auto", mt: isMobile ? 2 : 5 }}>
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          fullWidth
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" onClick={handleEmailSignIn} fullWidth>
          Sign in with Email
        </Button>
        <Button variant="text" color="primary" onClick={handlePasswordReset}>
          Forgot Password?
        </Button>
        <Typography variant="subtitle1">or</Typography>
        <Button variant="contained" color="secondary" onClick={handleGoogleSignIn} fullWidth>
          Sign in with Google
        </Button>
      </Box>
    </Box>
  );
};

export default SignIn;
