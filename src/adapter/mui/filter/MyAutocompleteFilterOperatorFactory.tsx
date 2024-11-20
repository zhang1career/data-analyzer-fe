'use client';

import {GridFilterOperator} from "@mui/x-data-grid";
import {SxProps} from "@mui/material";
import MyAutocompleteFilterInputFactory from "@/adapter/mui/filter/MyAutocompleteFilterInputFactory.tsx";


function MyAutocompleteFilterOperatorFactory(
  onSearch: (searchText: string) => Promise<string[]>,
  fieldName: string,
  sxTextField?: SxProps
): GridFilterOperator<any, { [key: number]: string }>[] {
  return [
    {
      label: 'Contains All',
      value: 'contains all',
      getApplyFilterFn: (filterItem) => {
        if (!filterItem.field || !filterItem.value || !filterItem.operator) {
          console.error(`[filter][${fieldName}] expression is not complete`);
          return null;
        }

        return (value) => {
          const filterValueList = Array(filterItem.value);
          if (filterValueList.length === 0) {
            return true;
          }

          const actualValueSet = new Set(Object.values(value));
          for (const filterValue in filterValueList) {
            if (!actualValueSet.has(filterValue)) {
              return false;
            }
          }
          return true;
        };
      },
      InputComponent: MyAutocompleteFilterInputFactory(onSearch, fieldName, sxTextField),
      InputComponentProps: {type: 'string []'},
      getValueAsString: (value: string[]) => `[filter][${fieldName}] value=${value}`,
    },
  ];
}

export default MyAutocompleteFilterOperatorFactory;