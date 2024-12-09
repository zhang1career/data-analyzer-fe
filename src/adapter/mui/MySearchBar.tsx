import React, {Children, Dispatch, FC, ReactElement, SetStateAction, useEffect, useState} from 'react';
import {Button, Stack, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {handleInputChangeByEvent} from "@/adapter/base/MyNamedValueInput.ts";
import {MyAssembleProps} from "@/adapter/defines/MyAssembleProps.ts";
import {ComponentProps} from "@/defines/combines/ComponentProps.ts";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";


interface SearchBarProps<T> extends MyAssembleProps, ClickableProps, ComponentProps {
  onSetFormData: Dispatch<SetStateAction<T>>;
  isAutoSubmit?: boolean;
}

/**
 * SearchBarProps
 * When isAutoSubmit is true, the search button will be hidden, and the search will be triggered automatically when any of the input fields changes.
 * @param label
 * @param onSetFormData
 * @param onClick
 * @param isAutoSubmit
 * @param children
 * @constructor
 */
const MySearchBar: FC<SearchBarProps<any>> = <T, >({
                                                     label = 'Search',
                                                     onSetFormData,
                                                     onClick: onClick = () => {
                                                       console.warn('SearchBarProps.onSubmit is not set');
                                                     },
                                                     isAutoSubmit = false,
                                                     children
                                                   }: SearchBarProps<T>) => {
  // onChange version, initial null
  const [onChangeAt, setOnChangeAt] = useState<number | null>(null);

  // wrap the input change event with named_input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChangeByEvent<T>(event, onSetFormData);
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
        {Children.map(children, (child) => {
          return React.cloneElement(child as ReactElement, {
            onChange: handleChange,
            ...child.props
          });
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