import {ThinkingResultVo} from "@/pojo/vo/ThinkingResultVo.ts";
import {WritingAnalysisDto} from "@/pojo/dto/WritingAnalysisDto.ts";
import {ThinkingModel} from "@/models/ThinkingModel.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";


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
