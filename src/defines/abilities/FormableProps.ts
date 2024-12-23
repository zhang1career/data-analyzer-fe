import {SetStateAction} from "react";

export interface FormableProps<V> {

  formData: V | null;

  setFormData: (data: V) => void;
}


export function setFormField<V extends object>(setFormData: (data: SetStateAction<V | null>) => void,
                                               key: string,
                                               value: any) {
  setFormData((prevObject) => (prevObject ? {...prevObject, [key as keyof V]: value} : {[key as keyof V]: value} as V));
}