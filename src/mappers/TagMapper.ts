import {TermMretOpt} from "@/pojo/opt/TermMretOpt.ts";
import {TagParseResultVo} from "@/pojo/vo/TagVo.ts";

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