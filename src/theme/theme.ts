// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // основной цвет кнопок и элементов
    },
    secondary: {
      main: '#e91e63',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '8px 16px',
          fontWeight: 600,
        },
      },
    },
    // Здесь можно добавить другие настройки для компонентов, как в тестовой версии
  },
});

export default theme;
