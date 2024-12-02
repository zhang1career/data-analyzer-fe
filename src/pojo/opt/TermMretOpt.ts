import {MyLabeledValue} from "@/adapter/base/MyLabeledValue.ts";

export interface TermMretOpt extends MyLabeledValue {
  // Custom props
  term: string;
  mret?: string;
}