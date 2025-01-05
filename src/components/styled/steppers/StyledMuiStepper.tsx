import {styled} from "@mui/material/styles";
import MuiStepper from "@/components/hocs/mui/steppers/MuiStepper.tsx";
import {blueGrey, purple} from "@mui/material/colors";


export const StyledMuiStepper = styled(MuiStepper)(({theme}) => ({
  backgroundColor: blueGrey[100],
}));

export const StyledMuiAuthorityStepper = styled(MuiStepper)(({theme}) => ({
  backgroundColor: purple[100]
}));