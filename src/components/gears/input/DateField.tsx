import React, {FC} from "react";
import MyDateField from "@/hocs/mui/input/MyDateField.tsx";
import {LabeledProps} from "@/defines/abilities/LabeledProps.ts";
import {ChangeableProps} from "@/defines/abilities/ChangeableProps.ts";
import {NamedValueProps} from "@/defines/combines/NamedValueProps.ts";


const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';


interface DateFieldProps extends LabeledProps, NamedValueProps<string>, ChangeableProps<string> {
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