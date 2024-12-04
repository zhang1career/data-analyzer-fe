'use client';

import React, {FC, useContext, useEffect, useState} from 'react';
import {Checkbox} from "@mui/material";
import {RoutingContext} from '@/components/providers/RoutingProvider.tsx';
import {NoticingContext} from '@/components/providers/NoticingProvider.tsx';
import MySearchBar from "@/adapter/mui/MySearchBar.tsx";
import {createThinking} from "@/client_io/ThinkingIO.ts";
import {Thinking} from "@/models/Thinking.ts";
import {modelToDto} from "@/mappers/ThinkingMapper.ts";
import {ThinkingResultVo} from "@/pojo/vo/ThinkingVo.ts";
import {ObjMap} from "@/components/helpers/ObjMap.ts";
import {getMiscDict} from "@/client_io/MiscIO.ts";
import {DictVo} from "@/pojo/vo/misc/DictVo.ts";
import {dictVoToOptBatch} from "@/mappers/misc/DictMapper.ts";
import {MyLabeledValueProps} from "@/adapter/defines/MyLabeledValueProps.ts";
import MyDropdownList from "@/adapter/mui/MyDropdownList.tsx";
import {DICT_SPEECH_ATTR, DICT_SPEECH_PRED} from "@/consts/Misc.ts";
import {SpeechVector} from "@/models/SpeechVector.ts";
import {MyAssembleProps} from "@/adapter/defines/MyAssembleProps.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";


interface ThinkingCreateProps extends MyAssembleProps {
  formData: Thinking | null
  onSetFormData: (thinking: Thinking) => void
  speechVectorMap?: ObjMap<SpeechVector, string>
}

const ThinkingCreate: FC<ThinkingCreateProps> = ({
                                                   formData,
                                                   onSetFormData,
                                                   speechVectorMap = new ObjMap()
                                                 }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // prepare data
  // graph vector map
  const [attrOpts, setAttrOpts] = useState<MyLabeledValueProps[] | null>(null);
  const [predOpts, setPredOpts] = useState<MyLabeledValueProps[] | null>(null);

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
  }, []);

  // thinking result
  const [thinkingResult, setThinkingResult] = useState<ThinkingResultVo | null>(null);

  // operation - create
  const handleCreateThinking = async () => {
    if (!formData) {
      console.log('[news][audit] No thinking form specified.');
      return;
    }
    const thinkingDto = modelToDto(formData, speechVectorMap);
    console.info('[thinking][create] param', thinkingDto);
    const thinkingResultObj = await createThinking(
      routing,
      thinkingDto);
    if (!thinkingResultObj) {
      throw new Error('[news][audit] No thinking result returned.');
    }
    Object.entries(thinkingResultObj).forEach(([_, value]) => {
      setThinkingResult(value);
    });
    // notice
    noticing('Thinking created!', {
      severity: 'success',
      autoHideDuration: 3000,
    });
  };

  return (
    <>
      <MySearchBar
        onSetFormData={onSetFormData}
        onSubmit={handleCreateThinking}
      >
        <MyDropdownList
          id={'attribute'}
          label={'attribute'}
          name={'attribute'}
          value={formData ? formData['attribute'] : EMPTY_STRING}
          options={attrOpts}
        />
        <Checkbox
          id={'isAttrReverse'}
          name={'isAttrReverse'}
          checked={formData ? formData['isAttrReverse'] : false}
        />
        <MyDropdownList
          id={'predicate'}
          label={'predicate'}
          name={'predicate'}
          value={formData ? formData['predicate'] : EMPTY_STRING}
          options={predOpts}
        />
        <Checkbox
          id={'isPredReverse'}
          name={'isPredReverse'}
          checked={formData ? formData['isPredReverse'] : false}
        />
      </MySearchBar>

      {thinkingResult && (
        <div>
          <p>news_id: {thinkingResult.news_id}</p>
          <p>content: {thinkingResult.content}</p>
          <p>refer: {JSON.stringify(thinkingResult.refer)}</p>
          <p>recover_tag: {thinkingResult.recover_tag}</p>
          <p>thinking: {thinkingResult.thinking}</p>
          <p>trace: {JSON.stringify(thinkingResult.trace)}</p>
          <p>score: {thinkingResult.score}</p>
        </div>
      )}
    </>
  );
}

export default ThinkingCreate;