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
  Typography,
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
      <Toolbar sx={{ display: "flex", justifyContent: "center", p: 2, minHeight: 80 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
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
              marginBottom: "8px",
            }}
          />
          <Typography variant="body2" color="text.secondary">
            EUC Race Pro
          </Typogr
