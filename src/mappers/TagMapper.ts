import {TermMretOpt} from "@/pojo/opt/TermMretOpt.ts";
import {TagVo, TagParseResultVo} from "@/pojo/vo/TagVo.ts";
import {Tag} from "@/models/Tag.ts";


export function voToModel(vo: TagVo): Tag {
  return {
    id: vo.id,
    name: vo.name,
    news: vo.news,
  };
}

export function parseResultVoToTermMretOpt(vo: TagParseResultVo): TermMretOpt {
  const text = vo.t + (vo.m ? ` - ${vo.m}` : '');

  return {
    term: vo.t,
    mret: vo.m ? vo.m : undefined,
    label: text,
    value: text,
  };
}

export function parseResultVoToTermMretOptBatch(vos: TagParseResultVo[]): TermMretOpt[] {
  return vos.map(parseResultVoToTermMretOpt);
}