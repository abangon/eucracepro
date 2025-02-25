// src/components/RegistrationForm.tsx
import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';

interface RegistrationFormProps {
  raceId: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ raceId }) => {
  // Здесь можно добавить логику регистрации, обработку формы и т.д.
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Регистрация на гонку {raceId}
      </Typography>
      <form>
        <TextField label="Имя" variant="outlined" fullWidth sx={{ mb: 2 }} />
        <TextField label="Email" variant="outlined" fullWidth sx={{ mb: 2 }} />
        <Button variant="contained" color="primary">
          Зарегистрироваться
        </Button>
      </form>
    </Box>
  );
};

export default RegistrationForm;
