import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {Button, Stack, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {SteppableProps} from "@/defines/combines/SteppableProps.ts";
import {StylableProps} from "@/defines/abilities/StylableProps.ts";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {handleInputChangeByEvent} from "@/defines/combines/NamedValueProps.ts";
import {NestableProps, setupChildren} from "@/defines/combines/NestableProps.ts";
import {AutoSubmitableProps} from "@/defines/combines/AutoSubmitableProps.ts";


interface SearchBarProps<T> extends SteppableProps, ClickableProps, NestableProps, StylableProps, AutoSubmitableProps {
  setFormData: Dispatch<SetStateAction<T>>;
}

/**
 * SearchBarProps
 * When isAutoSubmit is true, the search button will be hidden, and the search will be triggered automatically when any of the input fields changes.
 * @param isEditable
 * @param label
 * @param onSetFormData
 * @param onClick
 * @param isAutoSubmit
 * @param activeAt
 * @param setActiveAt
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
                                                     activeAt,
                                                     setActiveAt = () => console.debug('SearchBarProps.setActiveSubmitAt is not set'),
                                                     children
                                                   }: SearchBarProps<T>) => {
  // wrap the input change event with named_input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChangeByEvent<T>(event, setFormData);
    setActiveAt(Date.now());
  };

  // auto submit
  useEffect(() => {
    // if auto submit and changed
    if (isAutoSubmit && activeAt !== null) {
      onClick();
    }
    // reset active submit
    setActiveAt(null);
  }, [activeAt, isAutoSubmit, onClick]);

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