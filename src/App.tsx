import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Home from './pages/home';
import Races from './pages/races';
import Leaderboard from './pages/leaderboard';
import SignIn from './pages/signin';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/races" element={<Races />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
