import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green for primary buttons
    },
    secondary: {
      main: '#f44336', // Red for secondary actions
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 600,
    },
    body2: {
      fontSize: '0.9rem',
    },
  },
});

export default theme;
