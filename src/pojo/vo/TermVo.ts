import {GraphEdgeVo} from "@/pojo/vo/GraphVo.ts";

export interface TermVo {
  id: number;
  name: string;
  content: string;
  src_term: Map<string, TermVo>;
  dest_term: Map<string, TermVo>;
  r: Map<string, GraphEdgeVo>;
}

/**
 * Term Relation
 *  a: attribute relation
 *  ad: attribute direction
 *  d: dest node
 */
export interface TermRelationVo {
  a: string;
  ad: boolean;
  d: string;
}