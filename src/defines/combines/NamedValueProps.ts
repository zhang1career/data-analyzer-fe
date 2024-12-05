import {NamedProps} from "@/defines/abilities/NamedProps.ts";
import {ValuableProps} from "@/defines/abilities/ValuableProps.ts";

export interface NamedValueProps<Value> extends NamedProps, ValuableProps<Value> {
}