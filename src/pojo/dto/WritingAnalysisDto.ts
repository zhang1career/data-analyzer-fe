import {ThinkingResultDto} from "@/pojo/dto/ThinkingResultDto.ts";


export interface WritingAnalysisDto {
  topic: string;
  aspect: string;
  data: { [key: string]: ThinkingResultDto };
}