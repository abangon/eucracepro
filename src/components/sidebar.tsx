// src/components/sidebar.tsx
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo/eucrace-logo.jpg';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  // Удалён пункт "Sign In"
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Races', icon: <SportsEsportsIcon />, path: '/races' },
    { text: 'Leaderboard', icon: <LeaderboardIcon />, path: '/leaderboard' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#fff' },
      }}
    >
      <Toolbar>
        <Box
          sx={{
            width: '100%',
            p: 2, // равные отступы со всех сторон
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={logo}
            alt="EuCrace Logo"
            style={{
              width: '100%',
              maxWidth: '200px',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
