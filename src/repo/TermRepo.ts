import {Term, TermRelation} from "@/pojo/models/Term.ts";
import {TermVo} from "@/pojo/vos/TermVo.ts";


export function termVoToModel(vo: TermVo): Term {
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