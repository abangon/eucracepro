// src/components/navbar.tsx
import React from "react";
import { AppBar, Toolbar, Box, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { auth, logOut } from "../utils/firebase";

interface NavbarProps {
  onMenuClick: () => void; // Функция для открытия бокового меню на мобильных устройствах
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Определяем, мобильное устройство или нет

  const handleAuthClick = async () => {
    if (auth.currentUser) {
      await logOut();
      navigate("/"); // Перенаправление на главную после выхода
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <AppBar position="static" color="inherit" sx={{ borderBottom: "1px solid #e0e0e0", p: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: 0 }}>
        {/* Кнопка меню (гамбургер) для мобильных устройств */}
        {isMobile && (
          <IconButton onClick={onMenuClick} color="inherit">
            <MenuIcon />
          </IconButton>
        )}

        {/* Кнопки настроек и выхода */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {auth.currentUser && (
            <IconButton onClick={() => navigate("/settings")} color="primary">
              <SettingsIcon />
            </IconButton>
          )}
          <Button variant="outlined" color="primary" onClick={handleAuthClick} sx={{ ml: 1 }}>
            {auth.currentUser ? "Sign Out" : "Sign In"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
