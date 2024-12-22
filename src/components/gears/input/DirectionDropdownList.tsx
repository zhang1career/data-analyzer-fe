import MyDropdownList, {MyDropdownListProps} from "@/hocs/mui/MyDropdownList.tsx";
import {EditableProps} from "@/defines/abilities/EditableProps.ts";


const directionOpt = [
  {label: buildLabel(false), value: false},
  {label: buildLabel(true), value: true},
];

// build label by value
function buildLabel(value: boolean): string {
  return value ? '<-' : '->';
}


interface DirectionDropdownListProps extends MyDropdownListProps<boolean>, EditableProps {
  isReadOnly?: boolean,
}

const DirectionDropdownList: React.FC<DirectionDropdownListProps> = ({
                                                                       isReadOnly = false,
                                                                       isEditable,
                                                                       value,
                                                                       onChange,
                                                                       ...rest
                                                                     }) => {

  return (
    <MyDropdownList
      value={value}
      options={directionOpt}
      onChange={onChange}
      isEditable={!isReadOnly && isEditable}
      {...rest}
    />
  )
}

export default DirectionDropdownList;