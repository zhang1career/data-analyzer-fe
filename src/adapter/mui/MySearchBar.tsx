import React, {Dispatch, SetStateAction} from 'react';
import {Button, Stack, Toolbar} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps<T> {
  onSetFormData: Dispatch<SetStateAction<T>>;
  onSubmit?: () => void;
  children?: React.ReactNode;
}

const MySearchBar: React.FC<SearchBarProps<any>> = <T, >({
                                                           onSetFormData,
                                                           onSubmit = () => {
                                                             console.warn('SearchBarProps.onSubmit is not set');
                                                           },
                                                           children
                                                         }: SearchBarProps<T>) => {
  // form
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSetFormData((prevObject) => ({...prevObject, [event.target.name]: event.target.value}));
  };

  return (
    <Toolbar>
      <Stack direction="row" spacing={0.2}>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child as React.ReactElement, {onChange: handleChange});
        })}
      </Stack>
      <Button
        startIcon={<SearchIcon/>}
        onClick={onSubmit}
      >
      </Button>
    </Toolbar>
  );
}

export default MySearchBar;