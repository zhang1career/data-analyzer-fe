import {GraphEdgeVo} from "@/pojo/vo/SpeechVo.ts";

export interface TermVo {
  id: number;
  name: string;
  content: string;
  src_term: Map<string, TermVo>;
  dest_term: Map<string, TermVo>;
  r: Map<string, GraphEdgeVo>;
}