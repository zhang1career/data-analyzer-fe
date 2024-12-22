import {NamedProps} from "@/defines/abilities/NamedProps.ts";
import {ValuableProps} from "@/defines/abilities/ValuableProps.ts";
import {ChangeEvent, Dispatch, SetStateAction} from "react";


export interface NamedValueProps<Value> extends NamedProps, ValuableProps<Value> {
}


export function handleInputChangeByEvent<T>(event: ChangeEvent<HTMLInputElement>,
                                            setFormData: Dispatch<SetStateAction<T>>) {
  // todo: how to check if event is not a SyntheticEvent?
  if (typeof event !== 'object') {
    console.debug('[adaptr][input_change][skip] event is not a SyntheticEvent:', event);
    return;
  }
  console.debug('[adaptr][input_change] param:', event);

  if (event.target.type === 'checkbox') {
    setFormData((prevObject) => ({...prevObject, [event.target.name]: event.target.checked}));
    return;
  }
  // use event.target.value by default
  setFormData((prevObject) => ({...prevObject, [event.target.name]: event.target.value}));
}