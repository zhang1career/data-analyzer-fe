'use client';

import {GridFilterInputValueProps} from "@mui/x-data-grid";
import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {MyAutocompleteTextField} from "@/adapter/mui/MyAutocompleteTextField.tsx";
import {SxProps} from "@mui/material";

function MyAutocompleteFilterInputFactory(
  onSearch: (searchText: string) => Promise<string[]>,
  fieldName: string,
  sxTextField?: SxProps
) {
  return function AutocompleteFilterInput(props: GridFilterInputValueProps) {

    const {item, applyValue} = props;

    const [filter, setFilter] = useState<{ [key: string]: any }>({
      [fieldName]: [],
    });

    useEffect(() => {
      applyValue({...item, value: filter[fieldName]});
    }, [filter[fieldName]]);

    return (
      <Box
        sx={sxTextField}
      >
        <MyAutocompleteTextField
          id={fieldName}
          label={fieldName}
          placeholder={fieldName}
          initOptions={filter[fieldName]}
          value={filter[fieldName]}
          onSetValues={(value) => setFilter((prevObject) => ({...prevObject, [fieldName]: value}))}
          onSearch={onSearch}
          isEditable={true}
          sx={{width: '100%'}}
        />
      </Box>
    );
  }
}

export default MyAutocompleteFilterInputFactory;