import {TermVo} from "@/pojo/vo/TermVo.ts";
import {Term, TermRelation} from "@/models/Term.ts";

export function voToModel(vo: TermVo): Term {
  return {
    id: vo.id,
    name: vo.name,
    content: vo.content,
    relation: termRelationVoToModel(vo),
  };
}

function termRelationVoToModel(vo: TermVo) {
  const relationList: TermRelation[] = [];

  const srcTermMap = vo.src_term;
  if (Object.keys(srcTermMap).length !== 0) {
    Object.entries(srcTermMap).forEach(([key, value]) => {
      relationList.push({
        name: key,
        relation_type: value.relate_type,
        is_reverse: true
      });
    });
  }

  const destTermMap = vo.dest_term;
  if (Object.keys(destTermMap).length !== 0) {
    Object.entries(destTermMap).forEach(([key, value]) => {
      relationList.push({
        name: key,
        relation_type: value.relate_type,
        is_reverse: false
      });
    });
  }

  return relationList;
}