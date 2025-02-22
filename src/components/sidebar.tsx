import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Home, DirectionsCar, Leaderboard, Login } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        <ListItemButton component={Link} to="/">
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton component={Link} to="/races">
          <ListItemIcon><DirectionsCar /></ListItemIcon>
          <ListItemText primary="Races" />
        </ListItemButton>
        <ListItemButton component={Link} to="/leaderboard">
          <ListItemIcon><Leaderboard /></ListItemIcon>
          <ListItemText primary="Leaderboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/sign-in">
          <ListItemIcon><Login /></ListItemIcon>
          <ListItemText primary="Sign In" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
