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

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

interface DateInputProps extends LabeledProps, ValuableProps<string>, ChangeableProps<string> {
}

const DateInput: FC<DataInputProps> = ({
                                         label,
                                         value,
                                         onChange,
                                       }: DateInputProps) => {
  // date value
  const [date, setDate] = React.useState<Dayjs | null>(value ? dayjs(value, DATE_FORMAT) : null);

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
          onChange(newValue ? newValue.format(DATE_FORMAT) : EMPTY_STRING);
        }}
      />
    </LocalizationProvider>
  );
}

export default DateInput;