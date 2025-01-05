import {SetStateAction} from "react";
import {FormROProps} from "@/defines/abilities/FormROProps.ts";
import {FormWOProps} from "@/defines/abilities/FormWOProps.ts";


// todo: migrate with ValuableProps? It is a long way to go.
export interface FormRWProps<V> extends FormROProps<V>, FormWOProps<V> {
}


export function setFormField<V extends object>(setFormData: (data: SetStateAction<V | null>) => void,
                                               key: string,
                                               value: any) {
  setFormData((prevObject) => (prevObject ? {...prevObject, [key as keyof V]: value} : {[key as keyof V]: value} as V));
}