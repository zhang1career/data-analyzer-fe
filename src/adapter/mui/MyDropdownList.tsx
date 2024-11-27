import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import React from "react";


interface DropdownListProps {
  // Custom props
  value?: string
  options?: string[],
  onChange?: (event: SelectChangeEvent<HTMLInputElement>) => void,
  // Mui props
  id: string,
  label: string,
  name?: string,
}

const MyDropdownList: React.FC<DropdownListProps> = ({
                                                       value = '',
                                                       options = [],
                                                       onChange = () => {
                                                         console.warn('[adaptr][dropdownlist] onChange is not implemented');
                                                       },
                                                       ...rest
                                                     }) => {
  return (
    <div>
      <Select
        {...rest}
        value={value}
        onChange={onChange}
        variant={'outlined'}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default MyDropdownList;