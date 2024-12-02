export interface Term {
  id: number;
  name: string;
  content: string;
  relation: TermRelation[];
}

export function newTerm(name: string): Term {
  return {
    id: 0,
    name: name,
    content: '',
    relation: [],
  };
}

export interface TermRelation {
  name: string;
  relation_type: string;
  is_reverse?: boolean;
}

export interface TermGraph {
  nodes: TermGraphNode[];
  edges: TermGraphEdge[];
}

export interface TermGraphNode {
  id: number;
  label: string;
}

export interface TermGraphEdge {
  id: number,
  src_id: number,
  dest_id: number,
  label: string,
  speech_type: number,
}
