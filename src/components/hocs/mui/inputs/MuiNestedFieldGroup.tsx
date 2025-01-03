import React, {Dispatch, SetStateAction} from "react";
import {Stack} from "@mui/material";
import {StackOwnProps} from "@mui/material/Stack/Stack";
import {NestableProps, setupChildren} from "@/defines/combines/NestableProps.ts";
import {handleNestedFieldChangeByEvent} from "@/defines/combines/NamedValueProps.ts";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";


/**
 * MuiNestedFieldGroup component
 * @date 2024-12-12
 * @param onSetFormData
 * @param children
 */
interface MuiNestedFieldGroupProps<T> extends NestableProps, Omit<StackOwnProps, 'children'> {
  path: number[];
  onSetLocalFormData: Dispatch<SetStateAction<T>>;  // todo: could change to (newData: T) => void ?
  onSetNestedFormData: Dispatch<SetStateAction<T>>;  // todo: could change to (newData: T) => void ?
}

const MuiNestedFieldGroup: React.FC<MuiNestedFieldGroupProps<any>> = <T extends DerivableProps<T[]>, >({
                                                                                                         isEditable,
                                                                                                         path,
                                                                                                         onSetLocalFormData,
                                                                                                         onSetNestedFormData,
                                                                                                         children = [],
                                                                                                         ...rest
                                                                                                       }: MuiNestedFieldGroupProps<T>) => {
  // wrap the inputs change event with named_input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleNestedFieldChangeByEvent<T>(event, onSetLocalFormData, onSetNestedFormData, path);
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

export default MuiNestedFieldGroup;