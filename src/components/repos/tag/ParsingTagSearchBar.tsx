import React from "react";
import MyDropdownList from "@/hocs/mui/MyDropdownList.tsx";
import MySearchBar from "@/hocs/mui/MySearchBar.tsx";
import {ParseTagQo} from "@/pojo/qo/TagQo.ts";
import {TEXTBOX_WIDTH_MIN_PX} from "@/lookings/size.ts";
import {SteppableProps} from "@/defines/abilities/SteppableProps.ts";
import {FormRWProps} from "@/defines/combines/FormRWProps.ts";
import {TitledProps} from "@/defines/abilities/TitledProps.ts";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {NamedProps} from "@/defines/abilities/NamedProps.ts";


interface SearchBarForParsingTagProps extends SteppableProps, TitledProps, NamedProps, FormRWProps<ParseTagQo>, ClickableProps {
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
    <MySearchBar
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
      <MyDropdownList
        id={'subject_tag'}
        label={'subject'}
        name={name}
        value={formData?.[name as keyof ParseTagQo]}
        options={options}
        sx={{width: TEXTBOX_WIDTH_MIN_PX}}
      />
    </MySearchBar>
  );
}

export default ParsingTagSearchBar;