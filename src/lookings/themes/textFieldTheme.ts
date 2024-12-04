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

