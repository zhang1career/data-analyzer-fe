'use client';

import React from "react";
import MuiTextField from "@mui/material/TextField";
import {ThemeProvider} from "@mui/material";
import {outlinedTextFieldTheme} from "@/themes/theme.ts";

/**
 * TextField component
 * Can be switched between read only and editable.
 *
 * @param isReadOnly if true, the field is read only
 * @param isEditable if true and isReadOnly is false, the field is editable
 */
interface TextFieldProps {
  // Custom props
  isReadOnly?: boolean,
  isEditable?: boolean,
  // Mui props
  fullWidth?: boolean,
  id: string,
  label: string,
  multiline?: boolean,
  name: string,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  rows?: number,
  value: number | string,
  variant?: 'filled' | 'outlined' | 'standard'
}

const MyTextField: React.FC<TextFieldProps> = ({isReadOnly = false, isEditable, ...props}) => {
  return (
    <ThemeProvider theme={outlinedTextFieldTheme}>
    <MuiTextField
      slotProps={{htmlInput: {readOnly: isReadOnly || !isEditable}}}
      {...props}
    />
    </ThemeProvider>
  );
}

export default MyTextField;