import {StylableProps} from "@/defines/abilities/StylableProps.ts";
import {DerivableProps} from "@/defines/abilities/DerivableProps.ts";
import * as React from "react";

export interface ComponentProps<D = React.ReactNode> extends StylableProps, DerivableProps<D> {
}