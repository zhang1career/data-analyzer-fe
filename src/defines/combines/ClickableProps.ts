import {LabeledProps} from "@/defines/abilities/LabeledProps.ts";

/**
 * ClickableProps defines a clickable property.
 * @param onClick
 */
export interface ClickableProps extends LabeledProps {
  onClick?: () => void;
}