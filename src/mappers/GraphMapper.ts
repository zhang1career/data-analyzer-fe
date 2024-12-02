import {GraphVectorVo} from "@/pojo/vo/GraphVo.ts";
import {GraphVectorKey, GraphVectorType} from "@/pojo/map/GraphVectorMap.ts";
import {ObjMap} from "@/components/helpers/ObjMap.ts";


export function graphVectorVoToMapBatch(vos: GraphVectorVo[]): ObjMap<GraphVectorType, string> {
  const map = new ObjMap<GraphVectorType, string>()
  vos.forEach(vo => {
    map.set(new GraphVectorKey(vo.a, vo.ad, vo.p, vo.pd), vo.v);
  });
  return map;
}