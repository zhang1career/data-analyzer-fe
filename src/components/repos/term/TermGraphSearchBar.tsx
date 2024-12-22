import React from "react";
import MySearchBar from "@/hocs/mui/MySearchBar.tsx";
import MyDropdownList from "@/hocs/mui/MyDropdownList.tsx";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";
import {SearchTermGraphQo} from "@/pojo/qo/TermQo.ts";
import {TEXTBOX_WIDTH_MIN_PX} from "@/lookings/size.ts";
import {SteppableProps} from "@/defines/abilities/SteppableProps.ts";
import {TitledProps} from "@/defines/abilities/TitledProps.ts";
import {FormableProps} from "@/defines/abilities/FormableProps.ts";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";


interface SearchBarForTermGraphProps extends SteppableProps, TitledProps, FormableProps<SearchTermGraphQo>, ClickableProps {
  termMretFieldName: "term_mret";
  relationTypeFieldName: "relation_type";
  termMretOptions: LabeledValueProps<string>[] | null;
  relationTypeOptions: string[];
}

const TermGraphSearchBar: React.FC<SearchBarForTermGraphProps> = ({
                                                                    title,
                                                                    termMretFieldName,
                                                                    relationTypeFieldName,
                                                                    formData,
                                                                    setFormData,
                                                                    termMretOptions,
                                                                    relationTypeOptions,
                                                                    label,
                                                                    onClick,
                                                                    isNextEnabled,
                                                                  }) => {
  return (
    <MySearchBar
      isEditable={!isNextEnabled}
      title={title}
      setFormData={setFormData}
      label={label}
      onClick={onClick}
      isAutoSubmit={true}
      isNextEnabled={isNextEnabled}
    >
      <MyDropdownList
        id={"term_mret"}
        label={"term - mret"}
        name={termMretFieldName}
        value={formData?.[termMretFieldName as keyof SearchTermGraphQo]}
        options={termMretOptions}
        sx={{width: TEXTBOX_WIDTH_MIN_PX}}
      />
      <MyDropdownList
        id={"predicate_relation"}
        label={"predicate relation"}
        name={relationTypeFieldName}
        value={formData?.[relationTypeFieldName as keyof SearchTermGraphQo]}
        options={relationTypeOptions}
        sx={{width: TEXTBOX_WIDTH_MIN_PX}}
      />
    </MySearchBar>
  );
}

export default TermGraphSearchBar;