'use client';

import React, {useState} from "react";
import MuiTextField from "@mui/material/TextField";
import {ThemeProvider} from "@mui/material";
import {outlinedTextFieldTheme} from "@/lookings/themes/textFieldTheme.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {EditableProps} from "@/defines/abilities/EditableProps.ts";

/**
 * TextField component
 * Can be switched between read only and editable.
 *
 * @param isReadOnly if true, the field is read only
 * @param isEditable if true and isReadOnly is false, the field is editable
 * @param onChange the callback to change the field value, will be intercepted and validated
 * @param validator the validation rules
 */
interface MyTextFieldProps extends EditableProps {
  // Custom props
  isReadOnly?: boolean,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  validator?: { [key: string]: string },
  // Mui props
  error?: boolean,
  fullWidth?: boolean,
  helperText?: string,
  id: string,
  label: string,
  multiline?: boolean,
  name?: string,
  placeholder?: any,
  required?: boolean,
  rows?: number,
  value: any,
  variant?: 'filled' | 'outlined' | 'standard',
}

const MyTextField: React.FC<MyTextFieldProps> = ({
                                                   isReadOnly = false,
                                                   isEditable,
                                                   onChange = () => {
                                                     console.warn('[adaptr][textfield] onChange is not implemented');
                                                   },
                                                   required = false,
                                                   validator,
                                                   helperText = EMPTY_STRING,
                                                   ...rest
                                                 }) => {
  // validation
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(EMPTY_STRING);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    if (!event.target.validity.valid) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <ThemeProvider theme={outlinedTextFieldTheme}>
      <MuiTextField
        {...rest}
        slotProps={{
          htmlInput: {
            readOnly: isReadOnly || !isEditable,
            pattern: validator?.pattern,
            type: validator?.type,
          },
        }}
        onChange={handleChange}
        error={error}
        required={required}
        helperText={error ? errorMessage : helperText}
      />
    </ThemeProvider>
  );
}

export default MyTextField;