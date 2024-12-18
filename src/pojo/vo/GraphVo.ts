import {TermRelationVo} from "@/pojo/vo/TermVo.ts";

export interface GraphVo {
  nodes: GraphNodeVo[];
  edges: GraphEdgeVo[];
}

export interface GraphNodeVo {
  id: number;
  l: string;
}

export interface GraphEdgeVo {
  id: number,
  sid: number,
  did: number,
  l: string,
  sp: number,
}

/**
 * Graph Vector
 *   a: attribute relation
 *   ad: attribute direction
 *   p: predicate relation
 *   pd: predicate direction
 *   v: prompt
 *   c: cancelable
 */
export interface GraphVectorVo {
  a: string;
  ad: boolean;
  p: string;
  pd: boolean;
  v: string;
  c: boolean;
}

/**
 * Access Vector
 *   a: attribute relation
 *   ad: attribute direction
 *   d: dest node
 */
export type AccessVectorVo = TermRelationVo[];

