// src/components/navbar.tsx
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, logOut } from "../utils/firebase";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Определяем, мобильное устройство или нет

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

  const handleAuthClick = async () => {
    if (user) {
      await logOut();
      navigate("/"); // Перенаправление на главную после выхода
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <AppBar position="static" color="inherit" sx={{ borderBottom: "1px solid #e0e0e0", p: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Кнопка меню (гамбургер) для мобильных устройств */}
        {isMobile && (
          <IconButton onClick={onMenuClick} color="inherit">
            <MenuIcon />
          </IconButton>
        )}

        {/* Имя пользователя (адаптивное) */}
        {user && (
          <Typography
            variant="h6"
            color="primary"
            sx={{
              flexGrow: 1,
              textAlign: isMobile ? "center" : "left",
              fontSize: isMobile ? "1rem" : "1.25rem", // Адаптивный размер шрифта
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: isMobile ? "60%" : "unset",
            }}
          >
            {nickname || user.displayName || user.email}
          </Typography>
        )}

        {/* Кнопки настроек и выхода */}
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
