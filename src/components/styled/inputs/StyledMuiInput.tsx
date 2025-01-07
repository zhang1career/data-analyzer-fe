import {TextField} from "@mui/material";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import React from "react";


export const StyledMuiSmallPaddingTextField: React.FC<TextFieldProps> = ({
                                                                           ...rest
                                                                         }) => {
  return (
    <TextField
      {...rest}
      slotProps={{
        ...rest.slotProps,
        input: {
          ...rest.slotProps?.input,
          inputProps: {
            ...rest.slotProps?.input?.inputProps,
            size: "small",
          },
        },
      }}
    />
  );
};