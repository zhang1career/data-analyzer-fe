import {DictVo} from "@/pojo/vo/misc/DictVo.ts";
import {MyLabeledValueProps} from "@/adapter/defines/MyLabeledValueProps.ts";

export function dictVoToOptBatch(vos: DictVo[]): MyLabeledValueProps[] {
  const retList: MyLabeledValueProps[] = [];
  vos.forEach(vo => {
    retList.push({
      label: vo.k,
      value: vo.v
    });
  });
  return retList;
}