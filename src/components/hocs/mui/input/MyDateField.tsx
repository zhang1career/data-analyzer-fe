import React, {FC} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {MobileDatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {LabeledProps} from "@/defines/abilities/LabeledProps.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {ChangeableProps} from "@/defines/abilities/ChangeableProps.ts";
import {ValuableProps} from "@/defines/abilities/ValuableProps.ts";


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('UTC');


interface MyDateFieldProps extends LabeledProps, ValuableProps<string>, ChangeableProps<string> {
  dateFormat: string;
}

const MyDateField: FC<MyDateFieldProps> = ({
                                             label,
                                             value,
                                             dateFormat,
                                             onChange,
                                           }: MyDateFieldProps) => {
  // date value
  const [date, setDate] = React.useState<Dayjs | null>(value ? dayjs(value, dateFormat) : null);

  // return
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
    >
      <MobileDatePicker
        label={label}
        timezone={'UTC'}
        value={date}
        onChange={(newValue) => {
          setDate(newValue);
          console.log('newValue:', newValue);
          onChange(newValue ? newValue.format(dateFormat) : EMPTY_STRING);
        }}
      />
    </LocalizationProvider>
  );
}

export default MyDateField;