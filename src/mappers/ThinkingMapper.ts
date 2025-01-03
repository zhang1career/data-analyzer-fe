import {ThinkingModel} from "@/models/ThinkingModel.ts";
import {ThinkingDto} from "@/pojo/dto/ThinkingDto.ts";
import {SpeechVectorKey} from "@/pojo/map/SpeechVectorMap.ts";
import {ObjMap} from "@/defines/structures/ObjMap.ts";


export function modelToDto(m: ThinkingModel, speechVectorMap: ObjMap<SpeechVectorKey, string>): ThinkingDto {
  const k = new SpeechVectorKey(m.attribute, m.isAttrReverse, m.predicate, m.isPredReverse);
  const thinking = speechVectorMap.get(k) || '';

  // base info
  const dto: ThinkingDto = {
    topic: m.mret ? m.mret : m.term,
    aspect: m.mret ? m.term : '',
    thinking: thinking,
  };
  if (m.owner) {
    dto.owner = m.owner;
  }
  if (m.filter) {
    dto.filter = m.filter;
  }
  // further thinking
  if (m.children) {
    dto.further = m.children.map((f) => modelToDto(f, speechVectorMap));
  }

  return dto;
}