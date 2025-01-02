import React, {useContext, useEffect, useState} from "react";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";
import MuiNestedFieldGroup from "@/components/hocs/mui/inputs/MuiNestedFieldGroup.tsx";
import MyTextField from "@/components/hocs/mui/inputs/MyTextField.tsx";
import MyDropdownList from "@/components/hocs/mui/MyDropdownList.tsx";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {TEXTBOX_WIDTH_200_PX} from "@/lookings/size.ts";
import DirectionDropdownList from "@/components/gears/input/DirectionDropdownList.tsx";
import {ThinkingModel} from "@/models/ThinkingModel.ts";
import {FormROProps} from "@/defines/abilities/FormROProps.ts";
import {FormWOPropsBeta} from "@/defines/abilities/FormWOPropsBeta.ts";
import {getMiscDict} from "@/io/MiscIO.ts";
import {DICT_SPEECH_ATTR, DICT_SPEECH_PRED} from "@/consts/Misc.ts";
import {DictVo} from "@/pojo/vo/misc/DictVo.ts";
import {dictVoToOptBatch} from "@/mappers/misc/DictMapper.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";


interface ThinkingProps extends FormROProps<ThinkingModel>, FormWOPropsBeta<ThinkingModel> {
  path: number[],
  data: ThinkingModel | null,
}

const Thinking: React.FC<ThinkingProps> = ({
                                             path,
                                             data,
                                             formData,
                                             setFormData,
                                           }) => {
  // context
  const routing = useContext(RoutingContext);

  // prepare inputs
  // graph vector map
  const [attrOpts, setAttrOpts] = useState<LabeledValueProps<string>[] | null>(null);
  const [predOpts, setPredOpts] = useState<LabeledValueProps<string>[] | null>(null);

  useEffect(() => {
    const miscDictPromise = getMiscDict(
      routing,
      [DICT_SPEECH_ATTR, DICT_SPEECH_PRED],
      {});
    miscDictPromise.then((miscDict) => {
      const attrDictVoList = miscDict[DICT_SPEECH_ATTR] as DictVo[];
      setAttrOpts(dictVoToOptBatch(attrDictVoList));
    });
    miscDictPromise.then((miscDict) => {
      const predDictVoList = miscDict[DICT_SPEECH_PRED] as DictVo[];
      setPredOpts(dictVoToOptBatch(predDictVoList));
    });
  }, [routing]);

  return <MuiNestedFieldGroup
    isEditable={true}
    path={path}
    onSetFormData={(_setFormField) => {
      const _newFormData = _setFormField(formData);
      setFormData(_newFormData)
    }}
    direction="row"
    spacing={0.2}
    sx={{width: "80%"}}
  >
    <MyTextField
      id="term"
      label="term"
      name="term"
      value={data?.["term"]}
    />
    <MyTextField
      id="mret"
      label="mret"
      name="mret"
      value={data?.["mret"]}
    />
    <MyDropdownList
      id={"attribute"}
      label={"attribute"}
      name={"attribute"}
      value={data ? data["attribute"] : EMPTY_STRING}
      options={attrOpts}
      sx={{width: TEXTBOX_WIDTH_200_PX}}
    />
    <DirectionDropdownList
      id={"isAttrReverse"}
      name={"isAttrReverse"}
      value={data?.["isAttrReverse"] ?? false}
      label={"Is Attr Reverse?"}
    />
    <MyDropdownList
      id={"predicate"}
      label={"predicate"}
      name={"predicate"}
      value={data ? data["predicate"] : EMPTY_STRING}
      options={predOpts}
      sx={{width: TEXTBOX_WIDTH_200_PX}}
    />
    <DirectionDropdownList
      id={"isPredReverse"}
      name={"isPredReverse"}
      value={data?.["isPredReverse"] ?? false}
      label={"Is Pred Reverse?"}
    />
    <MyTextField
      id={"owner"}
      label={"owner"}
      name={"owner"}
      value={data?.["owner"]}
    />
    <MyTextField
      id="filter"
      label="filter"
      name="filter"
      value={data?.["filter"]}
    />
  </MuiNestedFieldGroup>;
}

export default Thinking;