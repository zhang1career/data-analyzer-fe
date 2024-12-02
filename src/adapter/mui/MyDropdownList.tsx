import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import React from "react";
import {BaseSelectProps} from "@mui/material/Select/Select";
import {checkLabeledValue, MyLabeledValue} from "@/adapter/base/MyLabeledValue.ts";


interface DropdownListProps<Value> extends BaseSelectProps<Value> {
  // Custom props
  name?: string,
  options?: string[] | MyLabeledValue[],
  // Mui props
  id: string,
  label: string,
  onChange?: (value: SelectChangeEvent<Value>, child: React.ReactNode) => void,
  value?: Value | ''
}

const MyDropdownList: React.FC<DropdownListProps<string>> = ({
                                                               options = [],
                                                               onChange = () => {
                                                                 console.warn('[adaptr][dropdown] onChange is not implemented');
                                                               },
                                                               value = '',
                                                               ...rest
                                                             }) => {
  return (
    <div>
      <Select
        {...rest}
        value={value}
        onChange={onChange}
        variant={'outlined'}>
        {/*{options.map((option) => (*/}
        {/*  <MenuItem key={option} value={option}>*/}
        {/*    {option}*/}
        {/*  </MenuItem>*/}
        {/*))}*/}
        {options.map((option, index) => {
            const isLabeledValue = checkLabeledValue(option);
            return (
              <MenuItem key={index} value={isLabeledValue ? option.value : option}>
                {isLabeledValue ? option.label : option}
              </MenuItem>
            );
          }
        )}
      </Select>
    </div>
  );
};

export default MyDropdownList;