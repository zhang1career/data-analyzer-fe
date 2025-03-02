import React from "react";
import MuiDropdownList, {MuiDropdownListProps} from "@/components/hocs/mui/inputs/MuiDropdownList.tsx";
import {EditableProps} from "@/defines/abilities/EditableProps.ts";


const directionOpt = [
  {label: buildLabel('F'), value: 'F'},
  {label: buildLabel('T'), value: 'T'},
];

// build label by value
function buildLabel(value: string): string {
  return (value === 'T') ? '<-' : '->';
}


/**
 * DirectionDropdownListProps
 * @param isReadOnly
 * @param isEditable
 * @param value
 * @param onChange event handler
 */
interface DirectionDropdownListProps extends MuiDropdownListProps<string>, EditableProps {
  isReadOnly?: boolean,
  setValue?: (value: boolean) => void,
}

const DirectionDropdownList: React.FC<DirectionDropdownListProps> = ({
                                                                       isReadOnly = false,
                                                                       isEditable,
                                                                       value,
                                                                       onChange,
                                                                       ...rest
                                                                     }) => {

  return (
    <MuiDropdownList
      value={value}
      options={directionOpt}
      onChange={onChange}
      isEditable={!isReadOnly && isEditable}
      {...rest}
    />
  )
}

export default DirectionDropdownList;