'use client';

import React, {useContext, useState} from 'react';
import {Checkbox} from "@mui/material";
import {RoutingContext} from '@/components/providers/RoutingProvider.tsx';
import {NoticingContext} from '@/components/providers/NoticingProvider.tsx';
import MySearchBar from "@/adapter/mui/MySearchBar.tsx";
import MyTextField from "@/adapter/mui/MyTextField.tsx";
import {createThinking} from "@/client_io/ThinkingIO.ts";
import {Thinking} from "@/models/Thinking.ts";
import {modelToDto} from "@/mappers/ThinkingMapper.ts";
import {GraphVectorMap} from "@/pojo/map/GraphVectorMap.ts";
import {buildEmptyThinkingResultVo, ThinkingResultVo} from "@/pojo/vo/ThinkingVo.ts";

interface ThinkingCreateProps {
  thinking: Thinking
  graphVectorMap?: GraphVectorMap
}

const ThinkingCreate: React.FC<ThinkingCreateProps> = ({
                                                         thinking,
                                                         graphVectorMap = new Map()
                                                       }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // thinking result
  const [thinkingResult, setThinkingResult] = useState<ThinkingResultVo | null>(null);

  // operation - create
  const handleCreate = async () => {
    console.info('[thinking][create] param', thinking);
    const thinkingResult = await createThinking(
      routing,
      modelToDto(thinking, graphVectorMap));
    setThinkingResult(thinkingResult || buildEmptyThinkingResultVo());
    // notice
    noticing('Thinking created!', {
      severity: 'success',
      autoHideDuration: 3000,
    });
  };

  return (
    <>
      {thinkingResult && (
        <div>
          <p>news_id: {thinkingResult.news_id}</p>
          <p>content: {thinkingResult.content}</p>
          <p>refer: {thinkingResult.refer.toString()}</p>
          <p>recover_tag: {thinkingResult.recover_tag}</p>
          <p>thinking: {thinkingResult.thinking}</p>
          <p>trace: {thinkingResult.trace.toString()}</p>
          <p>score: {thinkingResult.score}</p>
        </div>
      )}
    </>
  );
}

export default ThinkingCreate;