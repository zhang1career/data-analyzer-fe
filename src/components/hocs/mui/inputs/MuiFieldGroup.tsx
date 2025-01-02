import React, {Dispatch, SetStateAction} from "react";
import {Stack} from "@mui/material";
import {StackOwnProps} from "@mui/material/Stack/Stack";
import {NestableProps, setupChildren} from "@/defines/combines/NestableProps.ts";
import {handleFieldChangeByEvent} from "@/defines/combines/NamedValueProps.ts";


/**
 * MuiFieldGroup component
 * @date 2024-12-12
 * @param onSetFormData
 * @param children
 */
interface MuiFieldGroupProps<T> extends NestableProps, Omit<StackOwnProps, 'children'> {
  onSetFormData: Dispatch<SetStateAction<T>>; // todo: could change to (newData: T) => void ?
}

const MuiFieldGroup: React.FC<MuiFieldGroupProps<any>> = <T, >({
                                                                 isEditable,
                                                                 onSetFormData,
                                                                 children = [],
                                                                 ...rest
                                                               }: MuiFieldGroupProps<T>) => {
  // wrap the inputs change event with named_input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFieldChangeByEvent<T>(event, onSetFormData);
  };

  return (
    <Stack
      {...rest}
    >
      {setupChildren(children, {
        isEditable: isEditable,
        onChange: handleChange
      })}
    </Stack>
  );
}

export default MuiFieldGroup;