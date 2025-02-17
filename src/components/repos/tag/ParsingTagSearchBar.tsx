import React from "react";
import MuiDropdownList from "@/components/hocs/mui/inputs/MuiDropdownList.tsx";
import MuiSearchBar from "@/components/hocs/mui/MuiSearchBar.tsx";
import {ParseTagQo} from "@/pojo/qo/TagQo.ts";
import {WIDTH_MIN_PX} from "@/lookings/size.ts";
import {NextableProps} from "@/defines/abilities/NextableProps.ts";
import {FormRWProps} from "@/defines/combines/FormRWProps.ts";
import {TitledProps} from "@/defines/abilities/TitledProps.ts";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {NamedProps} from "@/defines/abilities/NamedProps.ts";


interface SearchBarForParsingTagProps extends NextableProps, TitledProps, NamedProps, FormRWProps<ParseTagQo>, ClickableProps {
  options: string[];
}

const ParsingTagSearchBar: React.FC<SearchBarForParsingTagProps> = ({
                                                                      title,
                                                                      name = 'tags',
                                                                      formData,
                                                                      setFormData,
                                                                      label,
                                                                      onClick,
                                                                      options,
                                                                      isNextEnabled,
                                                                    }) => {
  // active submit
  const [activeSubmitAt, setActiveSubmitAt] = React.useState<number | null>(null);

  return (
    <MuiSearchBar
      isEditable={!isNextEnabled}
      title={title}
      setFormData={setFormData}
      label={label}
      onClick={onClick}
      isAutoSubmit={true}
      activeAt={activeSubmitAt}
      setActiveAt={setActiveSubmitAt}
      isNextEnabled={isNextEnabled}
    >
      <MuiDropdownList
        id={'subject_tag'}
        label={'subject'}
        name={name}
        value={formData?.[name as keyof ParseTagQo]}
        options={options}
        sx={{width: WIDTH_MIN_PX}}
      />
    </MuiSearchBar>
  );
}

export default ParsingTagSearchBar;