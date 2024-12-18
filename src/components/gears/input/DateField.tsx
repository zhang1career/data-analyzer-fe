import React, {FC} from "react";
import {LabeledProps} from "@/defines/abilities/LabeledProps.ts";
import {ChangeableProps} from "@/defines/abilities/ChangeableProps.ts";
import {ValuableProps} from "@/defines/abilities/ValuableProps.ts";
import MyDateField from "@/hocs/mui/input/MyDateField.tsx";


const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';


interface DateFieldProps extends LabeledProps, ValuableProps<string>, ChangeableProps<string> {
}

const DateField: FC<DateFieldProps> = ({
                                         ...rest
                                       }: DateFieldProps) => {
  return (
    <MyDateField
      dateFormat={DATE_FORMAT}
      {...rest}
    />
  );
}

export default DateField;