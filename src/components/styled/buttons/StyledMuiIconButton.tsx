import {styled} from "@mui/material/styles";
import {IconButton} from "@mui/material";


export const StyledMuiIconButton = styled(IconButton)(({theme}) => ({
  color: theme.palette.primary.main,
  "&:hover": {
    color: theme.palette.primary.dark
  }
}));

export const StyledMuiCautiousIconButton = styled(IconButton)(({theme}) => ({
  color: theme.palette.error.main,
  "&:hover": {
    color: theme.palette.error.dark
  }
}));