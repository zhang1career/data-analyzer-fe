import {SetStateAction} from "react";
import {FormRoProps} from "@/defines/abilities/FormRoProps.ts";
import {FormWoProps} from "@/defines/abilities/FormWoProps.ts";


// todo: migrate with ValuableProps? It is a long way to go.
export interface FormRWProps<V> extends FormRoProps<V>, FormWoProps<V> {

  formData: V | null;

  setFormData: (data: V) => void;
}


export function setFormField<V extends object>(setFormData: (data: SetStateAction<V | null>) => void,
                                               key: string,
                                               value: any) {
  setFormData((prevObject) => (prevObject ? {...prevObject, [key as keyof V]: value} : {[key as keyof V]: value} as V));
}