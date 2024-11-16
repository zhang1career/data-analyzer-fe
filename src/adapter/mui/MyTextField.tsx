'use client';

import React from "react";
import MuiTextField from "@mui/material/TextField";
import {ThemeProvider} from "@mui/material";
import {outlinedTextFieldTheme} from "@/themes/theme.ts";

/**
 * TextField component
 * @param id
 * @param label
 * @param name
 * @param value
 * @param isReadOnly if true, the field is read only
 * @param isEditable if true and isReadOnly is false, the field is editable
 * @param onChange
 */
interface TextFieldProps {
  id: string;
  label: string;
  name: string;
  value: number | string;
  isReadOnly?: boolean;
  isEditable?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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