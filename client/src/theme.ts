import { createTheme } from '@mui/material/styles';
import { heIL, enUS } from '@mui/material/locale';

const oliveGreenLight = {
  main: '#708238', // ירוק זית בסיסי
  light: '#a0b16a', // ירוק בהיר
  dark: '#4a5a1a', // ירוק כהה
  contrastText: '#fff', // טקסט לבן בשביל ניגודיות
};

const oliveGreenDark = {
  main: '#4a5a1a',
  light: '#6b7c2a',
  dark: '#2c3a00',
  contrastText: '#fff',
};

export const createOliveTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: mode === 'light' ? oliveGreenLight : oliveGreenDark,
      background: {
        default: mode === 'light' ? '#f5f7e7' : '#2a2f1a', // רקע בהיר/כהה עדין
        paper: mode === 'light' ? '#ffffff' : '#3a4225', // רקע כרטיסים
      },
      text: {
        primary: mode === 'light' ? '#2c3a00' : '#e0e4cc', // טקסט כהה/בהיר
      },
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
    },
  });
