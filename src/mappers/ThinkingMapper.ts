import {Thinking} from "@/models/Thinking.ts";
import {ThinkingDto} from "@/pojo/dto/ThinkingDto.ts";
import {GraphVectorKey, GraphVectorType} from "@/pojo/map/GraphVectorMap.ts";
import {ObjMap} from "@/components/helpers/ObjMap.ts";


export function modelToDto(m: Thinking, graphVectorMap: ObjMap<GraphVectorType, string>): ThinkingDto {
  const k = new GraphVectorKey(m.attribute, m.isAttrReverse, m.predicate, m.isPredReverse);
  console.log('Graph vector map:', k, graphVectorMap);
  if (!graphVectorMap.has(k)) {
    throw new Error('Graph vector not found: ' + k.toString());
  }
  const thinking = graphVectorMap.get(k) || '';

  // base info
  const dto: ThinkingDto = {
    topic: m.mret ? m.mret : m.term,
    aspect: m.mret ? m.term : '',
    thinking: thinking,
  };
  // further thinking
  if (m.further) {
    dto.further = m.further.map((f) => modelToDto(f, graphVectorMap));
  }

  return dto;
}