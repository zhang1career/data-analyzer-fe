import {TagModel} from "@/models/TagModel.ts";

// todo: rename relation to relatonList
export interface TermModel {
  id: number;
  name: string;
  content: string;
  relation: TermRelationModel[];
  tagList: TagModel[];
}

// todo: remove this function, assign the caller a null value
export function buildEmptyTermModel(): TermModel {
  return {
    id: 0,
    name: '',
    content: '',
    relation: [],
    tagList: [],
  };
}

export interface TermRelationModel {
  id: number;
  destId: number;
  destName: string;
  relationType: string;
  isReverse: boolean;
  speechType: number;
}

export interface TermRelationMetaModel {
  relationType: string;
  isReverse: boolean;
}

// todo: rename nodes and edges to nodeList and edgeList
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
