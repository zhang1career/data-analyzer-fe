import {LabeledProps} from "@/defines/abilities/LabeledProps.ts";

/**
 * MyClickableProps defines a clickable property.
 * @param onClick
 */
export interface MyClickableProps extends LabeledProps {
  onClick: () => void;
}