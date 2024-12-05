import {DictVo} from "@/pojo/vo/misc/DictVo.ts";

import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";

export function dictVoToOptBatch(vos: DictVo[]): LabeledValueProps[] {
  const retList: LabeledValueProps[] = [];
  vos.forEach(vo => {
    retList.push({
      label: vo.k,
      value: vo.v
    });
  });
  return retList;
}