import {LabeledProps} from "@/defines/abilities/LabeledProps.ts";
import {ValuableProps} from "@/defines/abilities/ValuableProps.ts";

export interface MyLabeledValueProps extends LabeledProps, ValuableProps {
}

export const checkLabeledValue = (param: MyLabeledValueProps | any): param is MyLabeledValueProps => {
  return typeof param === 'object' && 'label' in param && 'value' in param;
};