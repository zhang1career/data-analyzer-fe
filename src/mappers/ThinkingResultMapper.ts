import {ThinkingResultVo} from "@/pojo/vo/ThinkingResultVo.ts";
import {ThinkingResultNewsTitleMap} from "@/models/ThinkingResult.ts";
import {addToSet} from "@/utils/MapCollUtil.ts";


export function voToNewsTitleMap(voMap: { [key: string]: ThinkingResultVo }): ThinkingResultNewsTitleMap {
  const resultMap: ThinkingResultNewsTitleMap = new Map();
  Object.entries(voMap).forEach(([_title, _vo]) => {
    _vo.news_id.forEach((id) => {
      addToSet(resultMap, id, _title);
    });
  });
  return resultMap;
}