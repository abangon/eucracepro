// src/components/sidebar.tsx
import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo/eucrace-logo.jpg";

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/" },
    { text: "Races", icon: <SportsEsportsIcon fontSize="small" />, path: "/races" },
    { text: "Leaderboard", icon: <LeaderboardIcon fontSize="small" />, path: "/leaderboard" },
  ];

  const drawerContent = (
    <Box sx={{ width: drawerWidth, height: "100vh", display: "flex", flexDirection: "column" }}>
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
              width: "80%",
              maxWidth: "180px",
              objectFit: "contain",
            }}
          />
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, flexGrow: 1 }}>
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
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: location.pathname === item.path ? "bold" : "normal",
                color: location.pathname === item.path ? "#1976d2" : "inherit",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Кнопка меню (гамбургер) должна быть видна ВСЕГДА */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          color="inherit"
          sx={{ position: "fixed", top: 10, left: 10, zIndex: (theme) => theme.zIndex.drawer + 2 }}
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
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            height: "100vh",
            position: "fixed",
            zIndex: (theme) => theme.zIndex.drawer + 1, // Теперь Sidebar выше Navbar
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Статичный Sidebar для больших экранов */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            height: "100vh",
            position: "fixed",
            zIndex: (theme) => theme.zIndex.drawer,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
