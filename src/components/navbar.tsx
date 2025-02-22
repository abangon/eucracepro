import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const Navbar: React.FC = () => {
  return (
    <AppBar position="fixed" sx={{ width: `calc(100% - 240px)`, ml: '240px' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          EUC Race Pro
        </Typography>
        <IconButton color="inherit">
          <SettingsIcon />
        </IconButton>
        <Avatar sx={{ ml: 2 }} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
