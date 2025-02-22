import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Races from './pages/Races';
import Leaderboard from './pages/Leaderboard';
import SignIn from './pages/SignIn';
import Box from '@mui/material/Box';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box
              component="main"
              sx={{
                flex: 1,
                p: 3,
                backgroundColor: 'background.default',
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/races" element={<Races />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/sign-in" element={<SignIn />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
