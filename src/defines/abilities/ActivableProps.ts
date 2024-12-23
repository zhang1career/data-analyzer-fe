import {Dispatch, SetStateAction} from "react";

export interface ActivableProps {
  activeAt?: number | null;
  setActiveAt?: Dispatch<SetStateAction<number | null>>;
}