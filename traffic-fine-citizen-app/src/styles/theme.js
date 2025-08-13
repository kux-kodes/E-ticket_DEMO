import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a192f', // Navy blue
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00b4d8', // Light blue accent
    },
    background: {
      default: '#ffffff', // White background
      paper: '#f8f9fa', // Slightly off-white for cards
    },
    text: {
      primary: '#0a192f', // Navy blue text
      secondary: '#495057', // Dark gray
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(10, 25, 47, 0.1)',
        },
      },
    },
  },
});

export default theme;
