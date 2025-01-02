import {NamedProps} from "@/defines/abilities/NamedProps.ts";
import {ValuableProps} from "@/defines/abilities/ValuableProps.ts";
import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";


export interface NamedValueProps<Value> extends NamedProps, ValuableProps<Value> {
}


/**
 * handle input change event
 * @param event
 * @param setFormData
 */
export function handleFieldChangeByEvent<T>(event: ChangeEvent<HTMLInputElement>,
                                            setFormData: Dispatch<SetStateAction<T>>) {
  // todo: how to check if event is not a SyntheticEvent?
  if (typeof event !== 'object') {
    console.debug('[adaptr][field_change][skip] event is not a SyntheticEvent:', event);
    return;
  }
  console.debug('[adaptr][input_change] param:', event);

  if (event.target.type === 'checkbox') {
    setFormData((prevObj) => ({...prevObj, [event.target.name]: event.target.checked}));
    return;
  }
  // use event.target.value by default
  setFormData((prevObj) => ({...prevObj, [event.target.name]: event.target.value}));
}


/**
 * handle nested field change event
 * @param event
 * @param setFormData
 * @param path
 */
export function handleNestedFieldChangeByEvent<T extends DerivableProps<T[]>>(event: ChangeEvent<HTMLInputElement>,
                                                                              setFormData: Dispatch<SetStateAction<T>>,
                                                                              path: number[]) {
  // todo: how to check if event is not a SyntheticEvent?
  if (typeof event !== 'object') {
    console.debug('[adaptr][nest_field_change][skip] event is not a SyntheticEvent:', event);
    return;
  }
  console.debug('[adaptr][nest_field_change] param:', event);


  if (event.target.type === 'checkbox') {
    setFormData((prevObj) => changeNestedField(prevObj, event.target.name, event.target.checked, path));
    return;
  }
  // use event.target.value by default
  setFormData((prevObj) => changeNestedField(prevObj, event.target.name, event.target.value, path));
}

function changeNestedField<T extends DerivableProps<T[]>>(originData: T,
                                                          key: string,
                                                          value: number | boolean | string,
                                                          path: number[]): T {
  if (path.length === 0) {
    return {...originData, [key]: value};
  }
  const [_focus_index, ...rest] = path;
  return {
    ...originData,
    children: originData.children?.map((_child, _index) =>
      _index === _focus_index
        ? changeNestedField(_child, key, value, rest)
        : _child
    ),
  };
}