import {SpeechVectorVo} from "@/pojo/vo/SpeechVo.ts";
import {SpeechVectorKey} from "@/pojo/map/SpeechVectorMap.ts";
import {ObjMap} from "@/components/helpers/ObjMap.ts";


export function speechVectorVoToMapBatch(vos: SpeechVectorVo[]): ObjMap<SpeechVectorKey, string> {
  const map = new ObjMap<SpeechVectorKey, string>()
  vos.forEach(vo => {
    map.set(new SpeechVectorKey(vo.a, vo.ad, vo.p, vo.pd), vo.v);
  });
  return map;
}