// src/components/navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}
    >
      <Toolbar sx={{ padding: 0 }}>
        <Box sx={{ width: { xs: '120px', md: '200px' } }}>
          <img
            src={logo}
            alt="EuCrace Logo"
            style={{ width: '100%', objectFit: 'contain' }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
