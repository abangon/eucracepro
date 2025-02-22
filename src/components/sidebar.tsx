// src/components/sidebar.tsx
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo/eucrace-logo.jpg";

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Для скрытия sidebar на больших экранах

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/" },
    { text: "Races", icon: <SportsEsportsIcon fontSize="small" />, path: "/races" },
    { text: "Leaderboard", icon: <LeaderboardIcon fontSize="small" />, path: "/leaderboard" },
  ];

  const drawerContent = (
    <Box sx={{ width: sidebarOpen ? drawerWidth : 70, transition: "width 0.3s" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="EuCrace Logo"
            style={{
              width: sidebarOpen ? "80%" : "50%",
              maxWidth: "180px",
              objectFit: "contain",
              transition: "width 0.3s",
            }}
          />
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: "8px",
              mb: 1,
              "&.Mui-selected": {
                backgroundColor: "#F4F6F8",
                "&:hover": { backgroundColor: "#E0E3E7" },
              },
              "&:hover": { backgroundColor: "#F4F6F8" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: location.pathname === item.path ? "#1976d2" : "inherit" }}>
              {item.icon}
            </ListItemIcon>
            {sidebarOpen && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: location.pathname === item.path ? "bold" : "normal",
                  color: location.pathname === item.path ? "#1976d2" : "inherit",
                }}
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Кнопка-гамбургер для мобильного меню */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          sx={{ position: "absolute", top: 16, left: 16, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Выдвижное меню для мобильных устройств */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Статичный Sidebar для больших экранов */}
      <Drawer
        variant="permanent"
        open={sidebarOpen}
        sx={{
          display: { xs: "none", md: "block" },
          [`& .MuiDrawer-paper`]: {
            width: sidebarOpen ? drawerWidth : 70,
            transition: "width 0.3s",
            boxSizing: "border-box",
            backgroundColor: "#FFFFFF",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
