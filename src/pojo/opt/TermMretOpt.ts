import {MyLabeledValueProps} from "@/adapter/defines/MyLabeledValueProps.ts";

export interface TermMretOpt extends MyLabeledValueProps {
  // Custom props
  term: string;
  mret?: string;
}