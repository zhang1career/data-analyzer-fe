import {Thinking} from "@/models/Thinking.ts";
import {ThinkingDto} from "@/pojo/dto/ThinkingDto.ts";
import {SpeechVectorKey} from "@/pojo/map/SpeechVectorMap.ts";
import {ObjMap} from "@/components/helpers/ObjMap.ts";
import {SpeechVector} from "@/models/SpeechVector.ts";


export function modelToDto(m: Thinking, speechVectorMap: ObjMap<SpeechVector, string>): ThinkingDto {
  const k = new SpeechVectorKey(m.attribute, m.isAttrReverse, m.predicate, m.isPredReverse);
  console.log('Speech vector map:', k, speechVectorMap);
  if (!speechVectorMap.has(k)) {
    throw new Error('Speech vector not found: ' + k.toString());
  }
  const thinking = speechVectorMap.get(k) || '';

  // base info
  const dto: ThinkingDto = {
    topic: m.mret ? m.mret : m.term,
    aspect: m.mret ? m.term : '',
    thinking: thinking,
  };
  // further thinking
  if (m.further) {
    dto.further = m.further.map((f) => modelToDto(f, speechVectorMap));
  }

  return dto;
}