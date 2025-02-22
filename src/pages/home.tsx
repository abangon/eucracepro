import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import FlagIcon from '@mui/icons-material/Flag';

const stats = [
  { title: 'Total Races', value: '52', icon: <EmojiEventsIcon />, color: '#FFF3E0' },
  { title: 'Training Sessions', value: '120', icon: <DirectionsCarIcon />, color: '#E3F2FD' },
  { title: 'Total Racers', value: '1,340', icon: <GroupsIcon />, color: '#F3E5F5' },
  { title: 'Total Laps', value: '15,230', icon: <FlagIcon />, color: '#FFEBEE' }
];

const Home: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: stat.color
              }}
            >
              {stat.icon}
              <Box>
                <Typography variant="h6">{stat.title}</Typography>
                <Typography variant="h4">{stat.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
