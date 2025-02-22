// src/components/navbar.tsx
import React from "react";
import { AppBar, Toolbar, Box, IconButton, Button, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { auth, logOut } from "../utils/firebase";
import SettingsIcon from "@mui/icons-material/Settings";

interface NavbarProps {
  handleDrawerToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleDrawerToggle }) => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        borderBottom: "1px solid #e0e0e0",
        px: 2,
        zIndex: (theme) => theme.zIndex.drawer + 1, // Чтобы навбар был выше сайдбара
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Кнопка меню для мобильных устройств */}
        <IconButton
          onClick={handleDrawerToggle}
          color="inherit"
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Правый блок с именем и кнопками */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user && (
            <>
              <Typography variant="subtitle2">{user.displayName || "User"}</Typography>
              <IconButton onClick={() => navigate("/settings")}>
                <SettingsIcon />
              </IconButton>
              <Button variant="outlined" onClick={logOut}>
                Sign Out
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
