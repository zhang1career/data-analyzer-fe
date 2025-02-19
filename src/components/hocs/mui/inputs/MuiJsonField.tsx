import React, {useState} from "react";
import {Box, TextField, Typography} from "@mui/material";
import {FormROProps} from "@/defines/abilities/FormROProps.ts";
import {FormWOPropsBeta} from "@/defines/abilities/FormWOPropsBeta.ts";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {TitledProps} from "@/defines/abilities/TitledProps.ts";
import MuiAutoButton from "@/components/hocs/mui/buttons/MuiAutoButton.tsx";
import {useDelayEffect} from "@/utils/DelayUtil.ts";


interface MuiJsonFieldProps<T> extends TitledProps, FormROProps<T>, FormWOPropsBeta<T>, ClickableProps {
}

const MuiJsonField: React.FC<MuiJsonFieldProps<any>> = <T, >({
                                                               title,
                                                               formData,
                                                               setFormData,
                                                               label = 'Submit',
                                                               onClick = () => {console.debug('MuiJsonField.onClick is not set')},
                                                             }: MuiJsonFieldProps<T>) => {
  // check params
  if (!formData || !setFormData) {
    throw new Error('[hoc][input] formData or setFormData is not specified.');
  }

  // data
  // json string
  const [jsonText, setJsonText] = useState<string>(JSON.stringify(formData, null, 2));
  // monitor
  useDelayEffect(() => {
    try {
      const parsedObject = JSON.parse(jsonText);
      setFormData(parsedObject);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Failed to save, invalid JSON format: '.concat(e.message));
      } else {
        console.error('Failed to save, unknown reason.');
      }
    }
  }, [jsonText], 1000);
  // error
  const [error, setError] = useState<string | null>(null);

  // operation - change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // check
    try {
      JSON.parse(value); // Validate JSON
      setError(null);
    } catch {
      setError("Failed to change, invalid JSON format.");
    }
    // save
    setJsonText(value);
  };

  const handleClick = () => {
    onClick();
  };

  return (
    <Box sx={{padding: 2, maxWidth: 600, margin: "0 auto"}}>
      {title && <Typography variant="h5" gutterBottom>
        {title}
      </Typography>}
      <TextField
        label="json-editor"
        multiline
        rows={10}
        fullWidth
        value={jsonText}
        onChange={handleChange}
        error={!!error}
        helperText={error || "Edit the JSON text"}
        variant="outlined"
      />
      <Box mt={2}>
        <MuiAutoButton
          label={label}
          onClick={handleClick}
          disabled={!!error}
        />
      </Box>
    </Box>
  );
};

export default MuiJsonField;