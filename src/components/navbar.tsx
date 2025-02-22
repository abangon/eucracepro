// src/components/navbar.tsx
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logOut } from "../utils/firebase";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthClick = async () => {
    if (user) {
      try {
        await logOut();
        navigate("/"); // перенаправляем на главную страницу после выхода
      } catch (error) {
        console.error("Error signing out:", error);
      }
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{ borderBottom: "1px solid #e0e0e0", p: 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user && (
            <Typography variant="h6" color="primary" sx={{ mr: 2 }}>
              {user.displayName || user.email}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user && (
            <IconButton onClick={() => navigate("/settings")} color="primary">
              <SettingsIcon />
            </IconButton>
          )}
          <Button variant="outlined" color="primary" onClick={handleAuthClick} sx={{ ml: 1 }}>
            {user ? "Sign Out" : "Sign In"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
