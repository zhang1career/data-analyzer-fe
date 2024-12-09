import {ChangeEvent, Dispatch, SetStateAction} from "react";


export function handleInputChangeByEvent<T>(event: ChangeEvent<HTMLInputElement>,
                                            onSetFormData: Dispatch<SetStateAction<T>>) {
  // todo: how to check if event is not a SyntheticEvent?
  if (typeof event !== 'object') {
    console.debug('[adaptr][input_change][skip] event is not a SyntheticEvent:', event);
    return;
  }
  console.debug('[adaptr][input_change] param:', event);

  if (event.target.type === 'checkbox') {
    onSetFormData((prevObject) => ({...prevObject, [event.target.name]: event.target.checked}));
    return;
  }
  // use event.target.value by default
  onSetFormData((prevObject) => ({...prevObject, [event.target.name]: event.target.value}));
}