export interface TermModel {
  id: number;
  name: string;
  content: string;
  relation: TermRelationModel[];
}

export function buildEmptyTermModel(): TermModel {
  return {
    id: 0,
    name: '',
    content: '',
    relation: [],
  };
}

export interface TermRelationModel {
  id: number;
  name: string;
  relation_type: string;
  is_reverse: boolean;
}

export interface TermGraphModel {
  nodes: TermGraphNodeModel[];
  edges: TermGraphEdgeModel[];
}

export interface TermGraphNodeModel {
  id: number;
  label: string;
}

export interface TermGraphEdgeModel {
  id: number,
  src_id: number,
  dest_id: number,
  label: string,
  speech_type: number,
}
