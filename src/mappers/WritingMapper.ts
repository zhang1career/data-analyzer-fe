import {ThinkingResultVo} from "@/pojo/vo/ThinkingResultVo.ts";
import {WritingAnalysisDto} from "@/pojo/dto/WritingAnalysisDto.ts";
import {ThinkingModel} from "@/models/ThinkingModel.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {jsonToDto} from "@/mappers/ThinkingResultMapper.ts";


export function thinkingResultToWritingAnalysisDto(m: ThinkingModel | null, obj: { [key: string]: ThinkingResultVo } | null): WritingAnalysisDto {
  if (!m || !obj) {
    return {
      topic: EMPTY_STRING,
      aspect: EMPTY_STRING,
      data: {}
    };
  }
  return {
    topic: m.mret ? m.mret : (m.term ?? EMPTY_STRING),
    aspect: m.mret ? (m.term ?? EMPTY_STRING) : EMPTY_STRING,
    data: obj
  };
}

export function jsonToWritingAnalysisDto(json: JSONType): WritingAnalysisDto {
  if (!json || typeof json !== 'object') {
    return {
      topic: EMPTY_STRING,
      aspect: EMPTY_STRING,
      data: {}
    };
  }
  if (Array.isArray(json)) {
    throw new Error('[mapper][jsonToWritingAnalysisDto] Array is not supported.');
  }
  if (!json.data || typeof json.data !== 'object' || Array.isArray(json.data)) {
    throw new Error('[mapper][jsonToWritingAnalysisDto] data is not supported.');
  }
  return {
    topic: json.topic ?? EMPTY_STRING,
    aspect: json.aspect ?? EMPTY_STRING,
    data: json.data ? Object.entries(json.data).map(([_title, _think]) => {_title: jsonToDto(_think)}): {}
  } as WritingAnalysisDto;
}