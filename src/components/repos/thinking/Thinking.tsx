import React, {useContext, useEffect, useState} from "react";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";
import MuiNestedFieldGroup from "@/components/hocs/mui/inputs/MuiNestedFieldGroup.tsx";
import MuiTextField from "@/components/hocs/mui/inputs/MuiTextField.tsx";
import MuiDropdownList from "@/components/hocs/mui/inputs/MuiDropdownList.tsx";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {WIDTH_200_PX} from "@/lookings/size.ts";
import DirectionDropdownList from "@/components/gears/input/DirectionDropdownList.tsx";
import {buildEmptyThinkingModel, ThinkingModel} from "@/models/ThinkingModel.ts";
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
import {Box} from "@mui/material";
import {Search} from "@mui/icons-material";
import {StyledMuiIconButton} from "@/components/styled/buttons/StyledMuiIconButton.tsx";
import {FormROPropsBeta} from "@/defines/abilities/FormROPropsBeta.ts";


interface ThinkingProps extends FormROPropsBeta<ThinkingModel>, FormWOPropsBeta<ThinkingModel> {
  path?: number[],
  data?: ThinkingModel | null,
}


const Thinking: React.FC<ThinkingProps> = ({
                                             path = [],
                                             data = null,
                                             formData = null,
                                             setFormData = () => {
                                               throw new Error('[repo][thinking] No form data setter specified.')
                                             },
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
      <Box sx={{display: 'flex', flexDirection: 'column', borderLeft: '1px solid grey', borderRadius: 2}}>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
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
            slotProps={{
              group: {
                direction: "row",
                spacing: 0.25,
                sx: {width: "80%"}
              },
              member: {
                sx: {width: "100%", margin: "normal", paddingTop: 0.25, paddingBottom: 0.25}
              }
            }}
          >
            <MuiTextField
              id="term"
              label="term"
              name="term"
              value={data?.["term"]}
            />
            <MuiTextField
              id="mret"
              label="mret"
              name="mret"
              value={data?.["mret"]}
            />
            <MuiDropdownList
              id={"attribute"}
              label={"attribute"}
              name={"attribute"}
              value={data ? data["attribute"] : EMPTY_STRING}
              options={attrOpts}
            />
            <DirectionDropdownList
              id={"isAttrReverse"}
              name={"isAttrReverse"}
              value={data?.["isAttrReverse"] ?? false}
              label={"Is Attr Reverse?"}
              sx={{width: WIDTH_200_PX, margin: "normal", paddingTop: 0.25, paddingBottom: 0.25}}
            />
            <MuiDropdownList
              id={"predicate"}
              label={"predicate"}
              name={"predicate"}
              value={data ? data["predicate"] : EMPTY_STRING}
              options={predOpts}
            />
            <DirectionDropdownList
              id={"isPredReverse"}
              name={"isPredReverse"}
              value={data?.["isPredReverse"] ?? false}
              label={"Is Pred Reverse?"}
              sx={{width: WIDTH_200_PX, margin: "normal", paddingTop: 0.25, paddingBottom: 0.25}}
            />
            <MuiTextField
              id={"owner"}
              label={"owner"}
              name={"owner"}
              value={data?.["owner"]}
            />
            <MuiTextField
              id="filter"
              label="filter"
              name="filter"
              value={data?.["filter"]}
            />
          </MuiNestedFieldGroup>

          <StyledMuiIconButton onClick={handleCreateThinking}>
            <Search/>
          </StyledMuiIconButton>
        </Box>

        <ThinkingResult
          formData={thinkingResultObj}
        />
      </Box>
    </>
  );
}

export default Thinking;