'use client';

import React, {useEffect, useState} from "react";
import {buildEmptyThinkingModel, ThinkingModel} from "@/models/ThinkingModel.ts";
import {ThinkingResultVo} from "@/pojo/vo/ThinkingResultVo.ts";
import {StyledMuiStepper} from "@/components/styled/steppers/StyledMuiStepper.tsx";
import NestedThinkingCreate from "@/clientings/thinking/NestedThinkingCreate.tsx";
import Analysis from "@/clientings/writing/Analysis.tsx";
import {thinkingResultToWritingAnalysisDto} from "@/mappers/WritingMapper.ts";
import {WritingAnalysisDto} from "@/pojo/dto/WritingAnalysisDto.ts";
import Summary from "@/clientings/writing/Summary.tsx";
import {buildWritingSummaryDto, WritingSummaryDto} from "@/pojo/dto/WritingSummaryDto.ts";


interface WritingProps {
}


const Writing: React.FC<WritingProps> = () => {
  // data
  const [thinkingModel, setThinkingModel] = useState<ThinkingModel | null>(buildEmptyThinkingModel);
  const [thinkingResultObj, setThinkingResultObj] = useState<{ [key: string]: ThinkingResultVo } | null>(null);
  const [writingAnalysisDto, setWritingAnalysisDto] = useState<WritingAnalysisDto | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [writingSummaryDto, setWritingSummaryDto] = useState<WritingSummaryDto | null>(null);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  // monitor for analysis
  useEffect(() => {
    if (thinkingModel && thinkingResultObj) {
      setWritingAnalysisDto(thinkingResultToWritingAnalysisDto(thinkingModel, thinkingResultObj));
    }
  }, [thinkingModel, thinkingResultObj]);
  // monitor for summary
  useEffect(() => {
    if (!analysisResult) {
      return;
    }
    setWritingSummaryDto(buildWritingSummaryDto(analysisResult));
  }, [analysisResult]);

  return (
    <StyledMuiStepper>
      <NestedThinkingCreate
        title="Create Thinking"
        description="Create Thinking"
        formData={thinkingModel}
        setFormData={setThinkingModel}
        result={thinkingResultObj}
        setResult={setThinkingResultObj}
        isNextEnabled={true}
      />
      <Analysis
        title="Analyze"
        description="Analyze"
        formData={writingAnalysisDto}
        setFormData={setWritingAnalysisDto}
        result={analysisResult}
        setResult={setAnalysisResult}
        isNextEnabled={true}
      />

      <Summary
        title="Summary"
        description="Summary"
        formData={writingSummaryDto}
        setFormData={setWritingSummaryDto}
        result={summaryResult}
        setResult={setSummaryResult}
        isNextEnabled={true}
      />
    </StyledMuiStepper>
  );
}

export default Writing;