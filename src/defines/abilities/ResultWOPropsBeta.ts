import {SetStateAction} from "react";

export interface ResultWOPropsBeta<V> {
  setResult: (data: SetStateAction<V | null>) => void;
}