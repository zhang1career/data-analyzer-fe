import {createTheme} from "@mui/material";

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