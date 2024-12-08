'use client';

import React, {FC, useContext, useEffect, useState} from 'react';
import {Checkbox, List, ListItem} from "@mui/material";
import {RoutingContext} from '@/components/providers/RoutingProvider.tsx';
import {NoticingContext} from '@/components/providers/NoticingProvider.tsx';
import MySearchBar from "@/adapter/mui/MySearchBar.tsx";
import {createThinking} from "@/io/ThinkingIO.ts";
import {Thinking} from "@/models/Thinking.ts";
import {modelToDto} from "@/mappers/ThinkingMapper.ts";
import {ObjMap} from "@/components/helpers/ObjMap.ts";
import {getMiscDict} from "@/io/MiscIO.ts";
import {DictVo} from "@/pojo/vo/misc/DictVo.ts";
import {dictVoToOptBatch} from "@/mappers/misc/DictMapper.ts";
import MyDropdownList from "@/adapter/mui/MyDropdownList.tsx";
import {DICT_SPEECH_ATTR, DICT_SPEECH_PRED} from "@/consts/Misc.ts";
import {MyAssembleProps} from "@/adapter/defines/MyAssembleProps.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";
import {TEXTBOX_WIDTH_MIN_PX} from "@/lookings/size.ts";
import {SpeechVectorKey} from "@/pojo/map/SpeechVectorMap.ts";
import {voToNewsTitleMap} from "@/mappers/ThinkingResultMapper.ts";
import {ThinkingResultNewsTitleMap} from "@/models/ThinkingResult.ts";
import {ThinkingResultVo} from "@/pojo/vo/ThinkingResultVo.ts";
import Typography from "@mui/material/Typography";


interface ThinkingCreateProps extends MyAssembleProps {
  formData: Thinking | null
  onSetFormData: (thinking: Thinking) => void
  speechVectorMap?: ObjMap<SpeechVectorKey, string>
  onSetResultData?: (result: ThinkingResultNewsTitleMap) => void
}

const ThinkingCreate: FC<ThinkingCreateProps> = ({
                                                   formData,
                                                   onSetFormData,
                                                   speechVectorMap = new ObjMap(),
                                                   onSetResultData = (result) => {
                                                     console.warn('[thinking][create] No result data setter specified.');
                                                   },
                                                 }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // prepare data
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
  }, []);

  // thinking result
  const [thinkingResultObj, setThinkingResultObj] = useState<{ [key: string]: ThinkingResultVo } | null>(null);

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
    setThinkingResultObj(thinkingResultObj);
    const newsTitleMap = voToNewsTitleMap(thinkingResultObj);
    onSetResultData(newsTitleMap);
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
        onClick={handleCreateThinking}
      >
        <MyDropdownList
          id={'attribute'}
          label={'attribute'}
          name={'attribute'}
          value={formData ? formData['attribute'] : EMPTY_STRING}
          options={attrOpts}
          sx={{width: TEXTBOX_WIDTH_MIN_PX}}
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
          sx={{width: TEXTBOX_WIDTH_MIN_PX}}
        />
        <Checkbox
          id={'isPredReverse'}
          name={'isPredReverse'}
          checked={formData ? formData['isPredReverse'] : false}
        />
      </MySearchBar>

      {thinkingResultObj && (
        <List>
          {Object.entries(thinkingResultObj).map(([_title, _vo]) => (
            <ListItem key={_title}>
              <Typography>{_title}</Typography>
              <Typography>{_vo.news_id}</Typography>
              <Typography>{_vo.content}</Typography>
              <Typography>{_vo.refer.toString()}</Typography>
              <Typography>{_vo.recover_tag}</Typography>
              <Typography>{_vo.thinking}</Typography>
              <Typography>{_vo.trace.toString()}</Typography>
              <Typography>{_vo.score}</Typography>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}

export default ThinkingCreate;