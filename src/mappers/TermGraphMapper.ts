import {TermGraph, TermGraphEdge, TermGraphNode} from "@/models/Term.ts";
import {GraphEdgeVo, GraphNodeVo, SpeechVo} from "@/pojo/vo/SpeechVo.ts";

export function voToModel(vo: SpeechVo): TermGraph {
  return {
    nodes: vo.nodes.map(termGraphNodeVoToModel),
    edges: vo.edges.map(termGraphEdgeVoToModel)
  };
}

function termGraphNodeVoToModel(vo: GraphNodeVo): TermGraphNode {
  return {
    id: vo.id,
    label: vo.l
  };
}

export function termGraphEdgeVoToModel(vo: GraphEdgeVo): TermGraphEdge {
  return {
    id: vo.id,
    src_id: vo.sid,
    dest_id: vo.did,
    label: vo.l,
    speech_type: vo.sp
  };
}