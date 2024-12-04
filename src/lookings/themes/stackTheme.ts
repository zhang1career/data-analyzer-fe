import {createTheme} from "@mui/material";

export const flexStackTheme = createTheme({
  components: {
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  },
});