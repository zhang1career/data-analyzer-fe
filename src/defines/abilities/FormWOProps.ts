import {SetStateAction} from "react";

export interface FormWOProps<V> {
  setFormData: (data: V | null) => void;
}