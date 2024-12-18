import {TermGraphModel, TermGraphEdgeModel, TermGraphNodeModel} from "@/models/TermModel.ts";
import {GraphEdgeVo, GraphNodeVo, GraphVo} from "@/pojo/vo/GraphVo.ts";

export function voToModel(vo: GraphVo): TermGraphModel {
  return {
    nodes: vo.nodes.map(termGraphNodeVoToModel),
    edges: vo.edges.map(termGraphEdgeVoToModel)
  };
}

function termGraphNodeVoToModel(vo: GraphNodeVo): TermGraphNodeModel {
  return {
    id: vo.id,
    label: vo.l
  };
}

export function termGraphEdgeVoToModel(vo: GraphEdgeVo): TermGraphEdgeModel {
  return {
    id: vo.id,
    src_id: vo.sid,
    dest_id: vo.did,
    label: vo.l,
    speech_type: vo.sp
  };
}