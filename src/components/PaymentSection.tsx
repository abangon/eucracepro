// src/components/PaymentSection.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface PaymentSectionProps {
  raceId: string;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ raceId }) => {
  // Здесь можно добавить логику интеграции платежей (например, с использованием Stripe или другого сервиса)
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payment for Race {raceId}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please proceed with payment to confirm your participation.
      </Typography>
      <Button variant="contained" color="secondary">
        Pay Now
      </Button>
    </Box>
  );
};

export default PaymentSection;
