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
