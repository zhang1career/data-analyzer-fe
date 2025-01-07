import React from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {checkLabeledValue} from "@/defines/combines/LabeledValueProps.ts";
import {MuiOptionableProps} from "@/components/hocs/mui/defines/MuiOptionalbeProps.ts";
import {EditableProps} from "@/defines/abilities/EditableProps.ts";
import {StyledMuiSmallPaddingFormControl} from "@/components/styled/inputs/StyledMuiDropdownList.tsx";


export interface MuiDropdownListProps<Value> extends EditableProps, MuiOptionableProps<Value> {
}

const MuiDropdownList: React.FC<MuiDropdownListProps<any>> = <T = string, >({
                                                                              isEditable,
                                                                              label,
                                                                              value = '',
                                                                              options = [],
                                                                              onChange = () => {
                                                                                console.debug('[hoc][dropdown] onChange is not implemented');
                                                                              },
                                                                              sx,  // todo: change to slots, slotProps
                                                                              ...rest
                                                                            }: MuiDropdownListProps<T>) => {

  return (
    <Box sx={sx}>
      <StyledMuiSmallPaddingFormControl
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
      </StyledMuiSmallPaddingFormControl>
    </Box>
  );
};

export default MuiDropdownList;