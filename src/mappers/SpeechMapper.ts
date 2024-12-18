import {GraphVectorVo} from "@/pojo/vo/GraphVo.ts";
import {SpeechVectorKey} from "@/pojo/map/SpeechVectorMap.ts";
import {ObjMap} from "@/components/helpers/ObjMap.ts";


export function speechVectorVoToMapBatch(vos: GraphVectorVo[]): ObjMap<SpeechVectorKey, string> {
  const map = new ObjMap<SpeechVectorKey, string>()
  vos.forEach(vo => {
    map.set(new SpeechVectorKey(vo.a, vo.ad, vo.p, vo.pd), vo.v);
  });
  return map;
}