import React, {useContext, useEffect, useState} from "react";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";
import MuiNestedFieldGroup from "@/components/hocs/mui/inputs/MuiNestedFieldGroup.tsx";
import MyTextField from "@/components/hocs/mui/inputs/MyTextField.tsx";
import MyDropdownList from "@/components/hocs/mui/MyDropdownList.tsx";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {TEXTBOX_WIDTH_200_PX} from "@/lookings/size.ts";
import DirectionDropdownList from "@/components/gears/input/DirectionDropdownList.tsx";
import {buildEmptyThinkingModel, ThinkingModel} from "@/models/ThinkingModel.ts";
import {FormROProps} from "@/defines/abilities/FormROProps.ts";
import {FormWOPropsBeta} from "@/defines/abilities/FormWOPropsBeta.ts";
import {getMiscDict} from "@/io/MiscIO.ts";
import {DICT_SPEECH_ATTR, DICT_SPEECH_PRED, DICT_SPEECH_VECTOR} from "@/consts/Misc.ts";
import {DictVo} from "@/pojo/vo/misc/DictVo.ts";
import {dictVoToOptBatch} from "@/mappers/misc/DictMapper.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {modelToDto} from "@/mappers/ThinkingMapper.ts";
import {createThinking} from "@/io/ThinkingIO.ts";
import {ObjMap} from "@/defines/structures/ObjMap.ts";
import {SpeechVectorKey} from "@/pojo/map/SpeechVectorMap.ts";
import {GraphVectorVo} from "@/pojo/vo/GraphVo.ts";
import {speechVectorVoToMapBatch} from "@/mappers/SpeechMapper.ts";
import {ThinkingResultVo} from "@/pojo/vo/ThinkingResultVo.ts";
import ThinkingResult from "@/components/repos/thinking/ThinkingResult.tsx";
import {Box, IconButton} from "@mui/material";
import MuiButton from "@/components/hocs/mui/buttons/MuiButton.tsx";
import {Search} from "@mui/icons-material";


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

  // local formData
  const [localFormData, setLocalFormData] = useState<ThinkingModel | null>(buildEmptyThinkingModel());

  // prepare inputs
  // speechVector, attrOpts and predOpts
  const [speechVectorMap, setSpeechVectorMap] = useState<ObjMap<SpeechVectorKey, string>>(new ObjMap());
  const [attrOpts, setAttrOpts] = useState<LabeledValueProps<string>[] | null>(null);
  const [predOpts, setPredOpts] = useState<LabeledValueProps<string>[] | null>(null);
  // query misc/dict
  useEffect(() => {
    const miscDictPromise = getMiscDict(
      routing,
      [DICT_SPEECH_VECTOR, DICT_SPEECH_ATTR, DICT_SPEECH_PRED],
      {});
    miscDictPromise.then((miscDict) => {
      const speechVectorVoList = miscDict[DICT_SPEECH_VECTOR] as GraphVectorVo[];
      setSpeechVectorMap(speechVectorVoToMapBatch(speechVectorVoList));
      const speechAttrVoList = miscDict[DICT_SPEECH_ATTR] as DictVo[];
      setAttrOpts(dictVoToOptBatch(speechAttrVoList));
      const speechPredVoList = miscDict[DICT_SPEECH_PRED] as DictVo[];
      setPredOpts(dictVoToOptBatch(speechPredVoList));
    });
  }, [routing]);

  // thinking result
  const [thinkingResultObj, setThinkingResultObj] = useState<{ [key: string]: ThinkingResultVo } | null>(null);

  // operation - create thinking
  const handleCreateThinking = async () => {
    if (!formData) {
      console.log('[think] No thinking forms specified.');
      return;
    }
    const thinkingDto = modelToDto(formData, speechVectorMap);
    const thinkingResultObj = await createThinking(
      routing,
      thinkingDto);
    if (!thinkingResultObj) {
      throw new Error(`[news][audit] No thinking result returned. thinkingDto: ${thinkingDto}`);
    }
    setThinkingResultObj(thinkingResultObj);
  };

  return (
    <>
      <Box sx={{display: "flex", flexDirection: "column"}}>
        <Box sx={{display: "flex", flexDirection: "row"}}>
          <MuiNestedFieldGroup
            isEditable={true}
            path={path}
            onSetLocalFormData={(_setFormField) => {
              const _newLocalFormData = _setFormField(localFormData);
              setLocalFormData(_newLocalFormData)
            }}
            onSetNestedFormData={(_setFormField) => {
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
          </MuiNestedFieldGroup>

          <MuiButton
            label={'Think'}
            onClick={handleCreateThinking}
          >
            <IconButton color="primary">
              <Search/>
            </IconButton>
          </MuiButton>
        </Box>

        <ThinkingResult
          formData={thinkingResultObj}
        />
      </Box>
    </>
  );
}

export default Thinking;