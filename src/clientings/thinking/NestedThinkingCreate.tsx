import React, {useContext, useEffect, useState} from "react";
import {buildEmptyThinkingModel, ThinkingModel} from "@/models/ThinkingModel.ts";
import {Box, Stack, Typography} from "@mui/material";
import Thinking from "@/components/repos/thinking/Thinking.tsx";
import MuiRecursiveEditor from "@/components/hocs/mui/iterations/MuiRecursiveEditor.tsx";
import {addChild, removeChild} from "@/defines/combines/NestableProps.ts";
import {Search} from "@mui/icons-material";
import {modelToDto} from "@/mappers/ThinkingMapper.ts";
import {createThinking} from "@/io/ThinkingIO.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {ObjMap} from "@/defines/structures/ObjMap.ts";
import {SpeechVectorKey} from "@/pojo/map/SpeechVectorMap.ts";
import {getMiscDict} from "@/io/MiscIO.ts";
import {DICT_SPEECH_VECTOR} from "@/consts/Misc.ts";
import {GraphVectorVo} from "@/pojo/vo/GraphVo.ts";
import {speechVectorVoToMapBatch} from "@/mappers/SpeechMapper.ts";
import ThinkingResult from "@/components/repos/thinking/ThinkingResult.tsx";
import {StyledMuiIconButton} from "@/components/styled/buttons/StyledMuiIconButton.tsx";
import {SteppableProps} from "@/defines/combines/SteppableProps.ts";
import {ThinkingResultVo} from "@/pojo/vo/ThinkingResultVo.ts";
import {ResultWOPropsBeta} from "@/defines/abilities/ResultWOPropsBeta.ts";
import {ResultROProps} from "@/defines/abilities/ResultROProps.ts";
import {FormROProps} from "@/defines/abilities/FormROProps.ts";
import {FormWOPropsBeta} from "@/defines/abilities/FormWOPropsBeta.ts";


interface NestedThinkingCreateProps extends SteppableProps,
  FormROProps<ThinkingModel>,
  FormWOPropsBeta<ThinkingModel>,
  ResultROProps<{ [key: string]: ThinkingResultVo }>,
  ResultWOPropsBeta<{ [key: string]: ThinkingResultVo }> {
}

const NestedThinkingCreate: React.FC<NestedThinkingCreateProps> = ({
                                                                     formData,
                                                                     setFormData = () => {throw new Error('[client][nested_thinking] No form data setter specified.')},
                                                                     result,
                                                                     setResult,
                                                                   }) => {
  // context
  const routing = useContext(RoutingContext);

  // dict
  const [speechVectorMap, setSpeechVectorMap] = useState<ObjMap<SpeechVectorKey, string>>(new ObjMap());
  // query misc/dict
  useEffect(() => {
    const miscDictPromise = getMiscDict(
      routing,
      [DICT_SPEECH_VECTOR],
      {});
    miscDictPromise.then((miscDict) => {
      const speechVectorVoList = miscDict[DICT_SPEECH_VECTOR] as GraphVectorVo[];
      setSpeechVectorMap(speechVectorVoToMapBatch(speechVectorVoList));
    });
  }, [routing]);

  const handleAddChild = (path: number[]) => {
    const updatedData = addChild(formData, path, buildEmptyThinkingModel());
    setFormData(updatedData);
  };

  const handleRemoveChild = (path: number[]) => {
    const updatedData = removeChild(formData, path);
    setFormData(updatedData);
  };

  // operation - create thinking
  const handleCreateThinking = async () => {
    if (!formData) {
      console.log('[client][nested_thinking] No thinking forms specified.');
      return;
    }
    const thinkingDto = modelToDto(formData, speechVectorMap);
    const thinkingResultObj = await createThinking(
      routing,
      thinkingDto);
    if (!thinkingResultObj) {
      throw new Error(`[client][nested_thinking] No thinking result returned. thinkingDto: ${thinkingDto}`);
    }
    setResult(thinkingResultObj);
  };

  return (
    <Box sx={{padding: 2}}>
      <Stack direction="row" spacing={0.2}>
        <Typography variant="h5">Thinking Editor</Typography>
        <StyledMuiIconButton onClick={handleCreateThinking}>
          <Search/>
        </StyledMuiIconButton>
      </Stack>
      <MuiRecursiveEditor
        path={[]}
        data={formData}
        formData={formData}
        setFormData={setFormData}
        onAddChild={handleAddChild}
        onRemoveChild={handleRemoveChild}
      >
        <Thinking/>
      </MuiRecursiveEditor>
      <Box mt={3}>
        <Typography variant="h6">Generated Structure:</Typography>
        {formData && <pre>{JSON.stringify(modelToDto(formData, speechVectorMap), null, 2)}</pre>}
      </Box>
      <Box mt={3}>
        <ThinkingResult
          formData={result}
        />
      </Box>
    </Box>
  );
};

export default NestedThinkingCreate;