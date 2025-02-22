import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { signInWithGoogle } from '../utils/firebase';

const SignIn: React.FC = () => {
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSignIn}>
        Sign in with Google
      </Button>
    </Box>
  );
};

export default SignIn;
