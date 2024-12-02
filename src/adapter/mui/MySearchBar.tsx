import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Button, Stack, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {handleNamedInputChange} from "@/adapter/base/MyNamedInput.ts";

interface SearchBarProps<T> {
  onSetFormData: Dispatch<SetStateAction<T>>;
  onSubmit?: () => void;
  label?: string;
  isAutoSubmit?: boolean;
  children?: React.ReactNode;
}

/**
 * SearchBarProps
 * When isAutoSubmit is true, the search button will be hidden, and the search will be triggered automatically when any of the input fields changes.
 *
 * @param onSetFormData
 * @param onSubmit
 * @param label
 * @param isAutoSubmit
 * @param children
 * @constructor
 */
const MySearchBar: React.FC<SearchBarProps<any>> = <T, >({
                                                           onSetFormData,
                                                           onSubmit = () => {
                                                             console.warn('SearchBarProps.onSubmit is not set');
                                                           },
                                                           label = '',
                                                           isAutoSubmit = false,
                                                           children
                                                         }: SearchBarProps<T>) => {
  // onChange version, initial null
  const [onChangeAt, setOnChangeAt] = useState<number | null>(null);

  // wrap the input change event with named_input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleNamedInputChange<T>(event, onSetFormData);
    setOnChangeAt(Date.now());
  };

  // auto submit
  useEffect(() => {
    // if auto submit and changed
    if (isAutoSubmit && onChangeAt !== null) {
      onSubmit();
    }
  }, [onChangeAt]);

  return (
    <Toolbar>
      <Stack direction="row" spacing={0.2}>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child as React.ReactElement, {onChange: handleChange});
        })}
      </Stack>
      {!isAutoSubmit && (
        <Button
          startIcon={<SearchIcon/>}
          onClick={onSubmit}
        >
          {label}
        </Button>
      )}
    </Toolbar>
  );
}

export default MySearchBar;