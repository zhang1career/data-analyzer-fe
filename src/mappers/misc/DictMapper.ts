import {DictVo} from "@/pojo/vo/misc/DictVo.ts";

import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";

export function dictVoToOptBatch(vos: DictVo[]): LabeledValueProps<string>[] {
  const retList: LabeledValueProps<string>[] = [];
  vos.forEach(vo => {
    retList.push({
      label: vo.k,
      value: vo.v
    });
  });
  return retList;
}

export function dictVoToSetBatch(vos: DictVo[]): Set<string> {
  const retSet: Set<string> = new Set();
  vos.forEach(vo => {
    retSet.add(vo.k);
  });
  return retSet;
}