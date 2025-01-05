import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {Button, Stack, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {SteppableProps} from "@/defines/combines/SteppableProps.ts";
import {StylableProps} from "@/defines/abilities/StylableProps.ts";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {handleFieldChangeByEvent} from "@/defines/combines/NamedValueProps.ts";
import {NestableProps, setupChildren} from "@/defines/combines/NestableProps.ts";
import {AutoSubmitableProps} from "@/defines/combines/AutoSubmitableProps.ts";


interface MuiSearchBarProps<T> extends SteppableProps, ClickableProps, NestableProps, StylableProps, AutoSubmitableProps {
  setFormData: Dispatch<SetStateAction<T>>;
}

/**
 * MuiSearchBarProps
 * When isAutoSubmit is true, the search button will be hidden, and the search will be triggered automatically when any of the inputs fields changes.
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
const MuiSearchBar: React.FC<MuiSearchBarProps<any>> = <T, >({
                                                               isEditable,
                                                               setFormData,
                                                               label = 'Search',
                                                               onClick = () => {
                                                                 console.warn('MuiSearchBarProps.onSubmit is not set');
                                                               },
                                                               isAutoSubmit = false,
                                                               activeAt,
                                                               setActiveAt = () => console.debug('MuiSearchBarProps.setActiveSubmitAt is not set'),
                                                               children
                                                             }: MuiSearchBarProps<T>) => {
  // wrap the inputs change event with named_input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFieldChangeByEvent<T>(event, setFormData);
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

export default MuiSearchBar;