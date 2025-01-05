import {LabeledProps} from "@/defines/abilities/LabeledProps.ts";
import {ValuableProps} from "@/defines/abilities/ValuableProps.ts";

export interface LabeledValueProps<Value> extends LabeledProps, ValuableProps<Value> {
}

export const checkLabeledValue = (param: LabeledValueProps<any> | any): param is LabeledValueProps<any> => {
  return typeof param === 'object' && 'label' in param && 'value' in param;
};