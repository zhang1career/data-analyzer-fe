import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {Button, Stack, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {MyAssembleProps} from "@/hocs/defines/MyAssembleProps.ts";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {handleInputChangeByEvent} from "@/defines/combines/NamedValueProps.ts";
import {NestableProps, setupChildren} from "@/defines/combines/NestableProps.ts";
import {StylableProps} from "@/defines/abilities/StylableProps.ts";


interface SearchBarProps<T> extends MyAssembleProps, ClickableProps, NestableProps, StylableProps {
  setFormData: Dispatch<SetStateAction<T>>;
  isAutoSubmit?: boolean;
}

/**
 * SearchBarProps
 * When isAutoSubmit is true, the search button will be hidden, and the search will be triggered automatically when any of the input fields changes.
 * @param isEditable
 * @param label
 * @param onSetFormData
 * @param onClick
 * @param isAutoSubmit
 * @param children
 * @constructor
 */
const MySearchBar: FC<SearchBarProps<any>> = <T, >({
                                                     isEditable,
                                                     setFormData,
                                                     label = 'Search',
                                                     onClick = () => {
                                                       console.warn('SearchBarProps.onSubmit is not set');
                                                     },
                                                     isAutoSubmit = false,
                                                     children
                                                   }: SearchBarProps<T>) => {
  // onChange version, initial null
  const [onChangeAt, setOnChangeAt] = useState<number | null>(null);

  // wrap the input change event with named_input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChangeByEvent<T>(event, setFormData);
    setOnChangeAt(Date.now());
  };

  // auto submit
  useEffect(() => {
    // if auto submit and changed
    if (isAutoSubmit && onChangeAt !== null) {
      onClick();
    }
  }, [onChangeAt]);

  return (
    <Toolbar>
      <Stack direction="row" spacing={0.2}>
        {setupChildren(children, {
          isEditable: isEditable,
          onChange: handleChange,
        })}
      </Stack>
      {!isAutoSubmit && (
        <Button
          startIcon={<SearchIcon/>}
          onClick={onClick}
        >
          {label}
        </Button>
      )}
    </Toolbar>
  );
}

export default MySearchBar;