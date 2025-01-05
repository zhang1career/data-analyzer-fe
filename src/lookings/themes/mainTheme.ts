'use client';

import {createTheme} from "@mui/material";
import {grey} from "@mui/material/colors";


export const mainTheme = createTheme({
  components: {
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "&:has([readonly]) ": {
            "& .MuiInputLabel-outlined": {
              color: grey[600],
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: grey[600],
            },
          },
        },
      },
    },
  },

  palette: {
    primary: {
      light: '#6573c3',
      main: '#3F51B5',
      dark: '#2c387e',
      contrastText: '#fff',
    },
    secondary: {
      light: '#6bc2b8',
      main: '#46B3A7',
      dark: '#317d74',
      contrastText: '#000',
    },
    error: {
      light: '#c36570',
      main: '#B53F4D',
      dark: '#7e2c35',
      contrastText: '#fff',
    },
    warning: {
      light: '#ffcb33',
      main: '#FFBF00',
      dark: '#b28500',
      contrastText: '#000',
    },
    info: {
      light: '#9778ce',
      main: '#7E57C2',
      dark: '#583c87',
      contrastText: '#fff',
    },
  },

  typography: {
    h1: {
      fontSize: '6rem',
      fontWeight: 300,
    },
  },
});