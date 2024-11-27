import {createTheme} from "@mui/material";
import {GREY} from "@/lookings/color.ts";

export const outlinedTextFieldTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "&:has([readonly]) ": {
            "& .MuiInputLabel-outlined": {
              color: GREY[600],
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: GREY[600],
            },
          },
        },
      },
    },
  },
});

export const mainTheme = createTheme({
  palette: {
    primary: {
      main: '#BEDBD7',
      light: '#84CADB',
      dark: '#84AFDB',
    },
    secondary: {
      main: '#83DBCF',
      light: '#84DBB2',
      dark: '#84DB94',
    },
    background: {
      default: '#cfd8dc',
      paper: '#BEDBD7',
    },
    success: {
      main: '#84DB94',
    },
    info: {
      main: '#84AFDB',
    },
  },
  typography: {
    h1: {
      fontSize: '6rem',
      fontWeight: 300,
    },
  },
});