import {createTheme} from "@mui/material";
import {GREY} from "@/themes/color.ts";

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

export const filledTextFieldTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "&:has([readonly]) ": {
            "& .MuiInputLabel-filled": {
              color: GREY[600],
            },
            "& .MuiFilledInput-root": {
              "&:before": {
                borderBottom: "1px solid " + GREY[600],
              },
            },
          },
        },
      },
    },
  },
});

export const standardTextFieldTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "&:has([readonly]) ": {
            "& .MuiInputLabel-standard": {
              color: GREY[600],
            },
            "& .MuiInput-root": {
              "&:before": {
                borderBottom: "1px solid " + GREY[600],
              },
            },
          },
        },
      },
    },
  },
});