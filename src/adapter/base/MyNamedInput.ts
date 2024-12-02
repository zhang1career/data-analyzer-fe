import {ChangeEvent, Dispatch, SetStateAction} from "react";

export function handleNamedInputChange<T>(event: ChangeEvent<HTMLInputElement>,
                                          onSetFormData: Dispatch<SetStateAction<T>>) {
  console.log('[adaptr][named_input] event.target.type=', event.target.type);
  if (event.target.type === 'checkbox') {
    onSetFormData((prevObject) => ({...prevObject, [event.target.name]: event.target.checked}));
    return;
  }
  // use event.target.value by default
  onSetFormData((prevObject) => ({...prevObject, [event.target.name]: event.target.value}));
}