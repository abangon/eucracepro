// src/components/navbar.tsx
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
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

  const handleAuthClick = () => {
    if (user) {
      logOut();
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
          <Typography variant="h6" color="primary">
            EuCracePro
          </Typography>
        </Box>
        <Box>
          <Button variant="outlined" color="primary" onClick={handleAuthClick}>
            {user ? "Sign Out" : "Sign In"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
