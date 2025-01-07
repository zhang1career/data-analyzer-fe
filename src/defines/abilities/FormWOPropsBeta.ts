import {SetStateAction} from "react";

export interface FormWOPropsBeta<V> {
  setFormData?: (data: SetStateAction<V | null>) => void;
}