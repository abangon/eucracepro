// src/pages/signIn.tsx
import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { signInWithGoogle } from '../utils/firebase';

const SignIn: React.FC = () => {
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Вход в систему
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSignIn}>
        Войти через Google
      </Button>
    </Box>
  );
};

export default SignIn;
