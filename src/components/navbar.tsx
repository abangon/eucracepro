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

  const handleAuthClick = async () => {
    if (user) {
      await logOut();
      navigate("/");
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: isMobile ? "100%" : `calc(100% - ${isSidebarOpen ? 240 : 0}px)`,
        marginLeft: isMobile ? 0 : `${isSidebarOpen ? 240 : 0}px`,
        transition: "width 0.3s, margin-left 0.3s",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
        {/* Кнопка меню (гамбургер) для мобильных устройств */}
        {isMobile && (
          <IconButton onClick={onMenuClick} color="inherit">
            <MenuIcon />
          </IconButton>
        )}

        {/* Блок с Username, Settings, Sign Out (Все элементы выровнены по расстоянию) */}
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto", gap: "16px" }}>
          {user && (
            <Typography
              variant="body1"
              color="primary"
              sx={{
                fontSize: 14, // Совпадает со шрифтом в Sidebar
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
              }}
            >
              {nickname || user.displayName || user.email}
            </Typography>
          )}
          {user && (
            <IconButton onClick={() => navigate("/settings")} color="primary" sx={{ fontSize: "1.2rem" }}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          )}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAuthClick}
            sx={{
              fontSize: 14, // Такой же размер, как текст в Sidebar
              fontWeight: "bold",
              textTransform: "none", // Отключаем заглавные буквы
            }}
          >
            {user ? "Sign Out" : "Sign In"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
