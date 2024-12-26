import React, {useContext, useEffect, useState} from "react";
import MySearchBar from "@/hocs/mui/MySearchBar.tsx";
import MyDropdownList from "@/hocs/mui/MyDropdownList.tsx";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";
import {SearchTermGraphQo} from "@/pojo/qo/TermQo.ts";
import {TEXTBOX_WIDTH_MIN_PX} from "@/lookings/size.ts";
import {SteppableProps} from "@/defines/abilities/SteppableProps.ts";
import {TitledProps} from "@/defines/abilities/TitledProps.ts";
import {FormRWProps} from "@/defines/combines/FormRWProps.ts";
import {ClickableProps} from "@/defines/combines/ClickableProps.ts";
import {getMiscDict} from "@/io/MiscIO.ts";
import {DICT_SPEECH_PRED} from "@/consts/Misc.ts";
import {DictVo} from "@/pojo/vo/misc/DictVo.ts";
import {dictVoToSetBatch} from "@/mappers/misc/DictMapper.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {checkEmpty as ArrayUtil_checkEmpty} from "@/utils/ArrayUtil.ts";
import {checkEmpty as SetUtil_checkEmpty} from "@/utils/SetUtil.ts";
import {AutoSubmitableProps} from "@/defines/combines/AutoSubmitableProps.ts";


interface SearchBarForTermGraphProps extends SteppableProps, TitledProps, FormRWProps<SearchTermGraphQo>, ClickableProps, AutoSubmitableProps {
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
                                                                    isAutoSubmit,
                                                                    activeAt,
                                                                    setActiveAt = () => {
                                                                      console.warn('SearchBarProps.setActiveSubmitAt is not set');
                                                                    },
                                                                    isNextEnabled,
                                                                  }) => {
  // context
  const routing = useContext(RoutingContext);

  // graph vector map
  const [predSet, setPredSet] = useState<Set<string> | null>(null);

  useEffect(() => {
    const miscDictPromise = getMiscDict(
      routing,
      [DICT_SPEECH_PRED],
      {});
    miscDictPromise.then((miscDict) => {
      const speechPredVoList = miscDict[DICT_SPEECH_PRED] as DictVo[];
      const _predSet = dictVoToSetBatch(speechPredVoList);
      setPredSet(_predSet);
    });
  }, [routing]);

  useEffect(() => {
    if (!formData || formData[relationTypeFieldName as keyof SearchTermGraphQo]) {
      return;
    }
    if (ArrayUtil_checkEmpty(relationTypeOptions)) {
      return;
    }
    if (SetUtil_checkEmpty(predSet)) {
      return;
    }

    relationTypeOptions.map((option) => {
      if (!predSet.has(option)) {
        return;
      }
      setFormData({
        ...formData,
        [relationTypeFieldName]: option,
      });
    });
  }, [formData, setFormData, relationTypeOptions, predSet, relationTypeFieldName]);


  return (
    <MySearchBar
      isEditable={!isNextEnabled}
      title={title}
      setFormData={setFormData}
      label={label}
      onClick={onClick}
      isAutoSubmit={isAutoSubmit}
      activeAt={activeAt}
      setActiveAt={setActiveAt}
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