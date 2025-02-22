// src/components/navbar.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { signInWithGoogle } from "../utils/firebase";

const Navbar: React.FC = () => {
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{ borderBottom: "1px solid #e0e0e0", p: 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: 0 }}>
        <Typography variant="h6" color="primary">
          EuCracePro
        </Typography>
        <Box>
          <Button variant="outlined" color="primary" onClick={handleSignIn}>
            Sign In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
