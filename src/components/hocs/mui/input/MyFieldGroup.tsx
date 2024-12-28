import React, {Dispatch, FC, SetStateAction} from "react";
import {Stack} from "@mui/material";
import {StackOwnProps} from "@mui/material/Stack/Stack";
import {NestableProps, setupChildren} from "@/defines/combines/NestableProps.ts";
import {handleInputChangeByEvent} from "@/defines/combines/NamedValueProps.ts";


/**
 * MyFieldGroupProps
 * @date 2024-12-12
 * @param onSetFormData
 * @param children
 */
interface MyFieldGroupProps<T> extends NestableProps, Omit<StackOwnProps, 'children'> {
  onSetFormData: Dispatch<SetStateAction<T>>;
}

const MyFieldGroup: FC<MyFieldGroupProps<any>> = <T, >({
                                                         isEditable,
                                                         onSetFormData,
                                                         children = [],
                                                         ...rest
                                                       }: MyFieldGroupProps<T>) => {
  // wrap the input change event with named_input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChangeByEvent<T>(event, onSetFormData);
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

export default MyFieldGroup;