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
import AboutUs from './pages/AboutUs';
import SignIn from './pages/signIn';
import Settings from './pages/settings';
import RaceDetailPage from './pages/races/RaceDetailPage';
import RaceDriverPage from './pages/races/RaceDriverPage';
import TestPage from './pages/Test';
import NotFound from './pages/NotFound';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FaTiktok } from "react-icons/fa";

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: "100vh" }}>
          <Sidebar 
            mobileOpen={mobileOpen} 
            handleDrawerToggle={handleDrawerToggle} 
            sx={{
              transition: "width 0.3s ease", // Плавный переход для открытия/закрытия
            }}
          />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              width: isMobile ? "100%" : `calc(100% - ${sidebarOpen ? 240 : 0}px)`, 
              transition: "width 0.3s ease, margin-left 0.3s ease", // Плавный переход для контента
              ml: isMobile ? 0 : `${sidebarOpen ? 240 : 0}px`,
            }}
          >
            <Navbar 
              onMenuClick={handleDrawerToggle} 
              isSidebarOpen={sidebarOpen} 
              sx={{
                "& .MuiTypography-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" }, // Уменьшаем шрифты в Navbar
                },
              }}
            />
            <Box sx={{ mt: { xs: 8, sm: 10 }, p: { xs: 2, sm: 3 } }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/races" element={<Races />} />
                <Route path="/races/:raceId" element={<RaceDetailPage />} />
                <Route path="/races/:raceId/driver/:chipNumber" element={<RaceDriverPage />} />
                <Route path="/races/:raceId/test" element={<TestPage />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
