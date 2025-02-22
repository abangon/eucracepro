// src/components/navbar.tsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, logOut } from "../utils/firebase";

interface NavbarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, isSidebarOpen }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname || null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AppBar position="fixed" color="inherit" sx={{ zIndex: 1302 }}>
      <Toolbar>
        {isMobile && (
          <IconButton onClick={onMenuClick} color="inherit">
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
