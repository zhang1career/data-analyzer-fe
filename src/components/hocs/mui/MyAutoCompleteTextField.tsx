import * as React from "react";
import {useState} from "react";
import {Autocomplete, AutocompleteChangeReason, SxProps, TextField} from "@mui/material";
import {AutocompleteChangeDetails} from "@mui/material/useAutocomplete/useAutocomplete";
import {useDelayEffect} from "@/utils/DelayUtil.ts";

/**
 * AutocompleteTextField component
 * Can be switched between read only and editable.
 *
 * @param isReadOnly if true, the field is read only
 * @param isEditable if true and isReadOnly is false, the field is editable
 * @param label the field label
 * @param initOptions the initial options
 * @param values the set values
 * @param onSetValues the callback to set values
 * @param onSearch the callback to search options
 */
interface MyAutoCompleteTextFieldProps {
  // Custom props
  isReadOnly?: boolean,
  isEditable?: boolean,
  // Mui props
  error?: boolean,
  helperText?: string,
  id: string;
  initOptions: string[];
  label: string;
  name?: string;
  onSearch: (searchText: string) => Promise<string[]>;
  onSetValues: (value: string[]) => void;
  placeholder?: any;
  required?: boolean,
  sx?: SxProps;
  value: string[];
}

export const MyAutoCompleteTextField: React.FC<MyAutoCompleteTextFieldProps> = ({
                                                                                isReadOnly = false,
                                                                                isEditable,
                                                                                label,
                                                                                placeholder,
                                                                                initOptions,
                                                                                value,
                                                                                onSetValues,
                                                                                onSearch,
                                                                                ...rest
                                                                              }) => {
  // options
  const [options, setOptions] = useState<string[]>(initOptions);

  // selection changes
  const handleSelectionChange = (event: React.SyntheticEvent<Element, Event>,
                                 value: string[],
                                 reason: AutocompleteChangeReason,
                                 details?: AutocompleteChangeDetails) => {
    console.debug('[hoc][autotext] selection change, value=', {event, value, reason, details});
    onSetValues(value)
    setLowFreqText(details?.option.toString() || '');
  };

  // inputs changes
  const handleInputChange = (event: React.SyntheticEvent,
                             value: string,
                             reason: string) => {
    console.debug('[hoc][autotexts] inputs change, value=', {event, value, reason});
    if (reason === 'input') {
      setLowFreqText(value);
    }
  };

  // textfield similar search
  const [lowFreqText, setLowFreqText] = useState<string>('');
  // delay to query and update options
  useDelayEffect(() => {
    if (!lowFreqText) {
      setOptions([]);
      return;
    }
    const optionListPromise = onSearch(lowFreqText);
    optionListPromise.then((optionList) => {
      setOptions(optionList);
    });
  }, [lowFreqText], 180);

  return (
    <Autocomplete
      {...rest}
      options={options}
      value={initOptions}
      onChange={handleSelectionChange}
      onInputChange={handleInputChange}
      renderInput={({inputProps, ...rest}) => (
        <TextField
          {...rest}
          slotProps={{htmlInput: {...inputProps, readOnly: isReadOnly || !isEditable}}}
          label={label}
          placeholder={placeholder}
          value={value}
        />
      )}
      autoSelect
      freeSolo
      multiple
      readOnly={isReadOnly || !isEditable}
    />
  );
}