import {styled} from "@mui/material/styles";
import {CardContent} from "@mui/material";


export const StyledMuiNoPaddingCardContent = styled(CardContent)(({theme}) => ({
  padding: 0,
  "&:last-child": {
    paddingBottom: 0
  }
}));