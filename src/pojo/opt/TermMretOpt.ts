import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";

export interface TermMretOpt extends LabeledValueProps<string> {
  // Custom props
  term: string;
  mret?: string;
}