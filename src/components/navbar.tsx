// src/components/navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}
    >
      <Toolbar sx={{ padding: 0 }}>
        <Typography variant="h6" color="primary">
          EuCracePro
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
