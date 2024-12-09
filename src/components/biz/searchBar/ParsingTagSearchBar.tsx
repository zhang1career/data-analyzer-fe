import React, {Dispatch, FC, SetStateAction} from "react";
import MyDropdownList from "@/adapter/mui/MyDropdownList.tsx";
import MySearchBar from "@/adapter/mui/MySearchBar.tsx";
import {ParseTagQo} from "@/pojo/qo/TagQo.ts";
import {TEXTBOX_WIDTH_MIN_PX} from "@/lookings/size.ts";
import {SteppableProps} from "@/defines/abilities/SteppableProps.ts";


interface SearchBarForParsingTagProps extends SteppableProps {
  title: string;
  fieldName: "tags";
  formData: ParseTagQo;
  onSetFormData: Dispatch<SetStateAction<ParseTagQo>>;
  options: string[];
  onClick: () => void;
}

const ParsingTagSearchBar: FC<SearchBarForParsingTagProps> = ({
                                                                   title,
                                                                   fieldName,
                                                                   formData,
                                                                   onSetFormData,
                                                                   options,
                                                                   onClick,
                                                                   isNextEnabled,
                                                                 }) => {
  return (
    <MySearchBar
      title={title}
      onSetFormData={onSetFormData}
      onClick={onClick}
      isAutoSubmit={true}
      isNextEnabled={isNextEnabled}
    >
      <MyDropdownList
        id={"subject_tag"}
        label={"subject"}
        name={fieldName}
        value={formData[fieldName]}
        options={options}
        sx={{width: TEXTBOX_WIDTH_MIN_PX}}
      />
    </MySearchBar>
  );
}

export default ParsingTagSearchBar;