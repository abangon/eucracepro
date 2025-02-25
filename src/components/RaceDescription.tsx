// Пример: src/components/RaceDescription.tsx
import React from "react";
import { Typography, Box } from "@mui/material";

interface RaceDescriptionProps {
  description: string;
}

const RaceDescription: React.FC<RaceDescriptionProps> = ({ description }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6">Описание гонки</Typography>
      <Typography variant="body1">{description}</Typography>
    </Box>
  );
};

export default RaceDescription;
