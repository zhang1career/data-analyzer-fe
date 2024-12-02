export interface MyLabeledValue {
  label: string;
  value: string;
}

export const checkLabeledValue = (param: MyLabeledValue | any): param is MyLabeledValue => {
  return typeof param === 'object' && 'label' in param && 'value' in param;
};