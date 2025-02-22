import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

const Sidebar: React.FC = () => {
  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/races">
          <ListItemText primary="Races" />
        </ListItem>
        <ListItem button component={Link} to="/leaderboard">
          <ListItemText primary="Leaderboard" />
        </ListItem>
        <ListItem button component={Link} to="/sign-in">
          <ListItemText primary="Sign In" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
