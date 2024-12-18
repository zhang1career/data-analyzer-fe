import React, {Dispatch, FC, SetStateAction} from "react";
import MySearchBar from "@/hocs/mui/MySearchBar.tsx";
import MyDropdownList from "@/hocs/mui/MyDropdownList.tsx";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";
import {SearchTermGraphQo} from "@/pojo/qo/TermQo.ts";
import {TEXTBOX_WIDTH_MIN_PX} from "@/lookings/size.ts";
import {SteppableProps} from "@/defines/abilities/SteppableProps.ts";


interface SearchBarForTermGraphProps extends SteppableProps {
  title: string;
  termMretFieldName: "term_mret";
  relationTypeFieldName: "relation_type";
  onSetFormData: Dispatch<SetStateAction<SearchTermGraphQo>>;
  formData: SearchTermGraphQo;
  termMretOptions: LabeledValueProps<string>[] | null;
  relationTypeOptions: string[];
  onClick: () => void;
}

const TermGraphSearchBar: FC<SearchBarForTermGraphProps> = ({
                                                                 title,
                                                                 termMretFieldName,
                                                                 relationTypeFieldName,
                                                                 onSetFormData,
                                                                 formData,
                                                                 termMretOptions,
                                                                 relationTypeOptions,
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
        id={"term_mret"}
        label={"term - mret"}
        name={termMretFieldName}
        value={formData[termMretFieldName]}
        options={termMretOptions}
        sx={{width: TEXTBOX_WIDTH_MIN_PX}}
      />
      <MyDropdownList
        id={"predicate_relation"}
        label={"predicate relation"}
        name={relationTypeFieldName}
        value={formData[relationTypeFieldName]}
        options={relationTypeOptions}
        sx={{width: TEXTBOX_WIDTH_MIN_PX}}
      />
    </MySearchBar>
  );
}

export default TermGraphSearchBar;