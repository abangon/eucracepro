// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import Home from './pages/home';
import Races from './pages/races';
import Leaderboard from './pages/leaderboard';
import SignIn from './pages/signIn';
import Settings from './pages/settings';
import Box from '@mui/material/Box';

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Navbar onMenuClick={handleDrawerToggle} isSidebarOpen={sidebarOpen} />
            <Box sx={{ mt: 10, p: 3 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/races" element={<Races />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
