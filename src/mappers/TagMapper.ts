import {TermMretOpt} from "@/pojo/opt/TermMretOpt.ts";
import {TagParseResultVo, TagVo} from "@/pojo/vo/TagVo.ts";
import {TagModel} from "@/models/TagModel.ts";


export function voToModel(vo: TagVo): TagModel {
  return {
    id: vo.id,
    name: vo.name,
    news: vo.news,
    newsCount: vo.news.length,
  };
}

export function voToModelBatch(vos: TagVo[]): TagModel[] {
  return vos.map(voToModel);
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