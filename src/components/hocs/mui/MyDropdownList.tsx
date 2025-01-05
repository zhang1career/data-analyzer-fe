import React from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {checkLabeledValue} from "@/defines/combines/LabeledValueProps.ts";
import {MuiOptionableProps} from "@/components/hocs/mui/defines/MuiOptionalbeProps.ts";
import {EditableProps} from "@/defines/abilities/EditableProps.ts";


export interface MyDropdownListProps<Value> extends EditableProps, MuiOptionableProps<Value> {
}

const MyDropdownList: React.FC<MyDropdownListProps<any>> = <T = string, >({
                                                                            isEditable,
                                                                            label,
                                                                            value = '',
                                                                            options = [],
                                                                            onChange = () => {
                                                                              console.debug('[adaptr][dropdown] onChange is not implemented');
                                                                            },
                                                                            sx,
                                                                            ...rest
                                                                          }: MyDropdownListProps<T>) => {

  return (
    <Box sx={sx}>
      <FormControl
        disabled={!isEditable}
        fullWidth
      >
        <InputLabel>{label}</InputLabel>
        <Select
          {...rest}
          value={value}
          onChange={onChange}
          variant={'outlined'}
        >
          {options && options.map((option, index) => {
              const isLabeledValue = checkLabeledValue(option);
              return (
                <MenuItem
                  key={index}
                  value={isLabeledValue ? option.value : option}
                >
                  {isLabeledValue ? option.label : option}
                </MenuItem>
              );
            }
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MyDropdownList;