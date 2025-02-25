// src/components/RegistrationForm.tsx
import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';

interface RegistrationFormProps {
  raceId: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ raceId }) => {
  // Add your registration logic and form handling here.
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Registration for Race {raceId}
      </Typography>
      <form>
        <TextField label="Name" variant="outlined" fullWidth sx={{ mb: 2 }} />
        <TextField label="Email" variant="outlined" fullWidth sx={{ mb: 2 }} />
        <Button variant="contained" color="primary">
          Register
        </Button>
      </form>
    </Box>
  );
};

export default RegistrationForm;
