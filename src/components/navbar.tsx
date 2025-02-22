// src/components/navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" color="inherit" sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        <IconButton color="primary" edge="start" sx={{ mr: 2, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="primary" noWrap>
          EuCracePro
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
