import React from "react";
import {FormControlProps} from "@mui/material/FormControl/FormControl";
import FormControl from "@mui/material/FormControl";


export const StyledMuiSmallPaddingFormControl: React.FC<FormControlProps> = ({
                                                                               ...rest
                                                                             }) => {
  return (
    <FormControl
      {...rest}
      size={'small'}
    />
  );
};