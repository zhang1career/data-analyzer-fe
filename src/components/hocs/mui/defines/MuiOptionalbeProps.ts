import {BaseSelectProps} from "@mui/material/Select/Select";
import {NamedValueProps} from "@/defines/combines/NamedValueProps.ts";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";


export interface MuiOptionableProps<Value> extends BaseSelectProps<Value>, NamedValueProps<Value> {
  options?: string[] | LabeledValueProps<string>[] | null,
}