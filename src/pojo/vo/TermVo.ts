import {GraphEdgeVo} from "@/pojo/vo/GraphVo.ts";

export interface TermVo {
  id: number;
  name: string;
  content: string;
  src_term: Map<string, TermVo>;
  dest_term: Map<string, TermVo>;
  r: Map<string, GraphEdgeVo>;
}

export function newTermVo(name: string): TermVo {
  return {
    id: 0,
    name: name,
    content: "",
    src_term: new Map<string, TermVo>(),
    dest_term: new Map<string, TermVo>(),
    r: new Map<string, GraphEdgeVo>(),
  };
}