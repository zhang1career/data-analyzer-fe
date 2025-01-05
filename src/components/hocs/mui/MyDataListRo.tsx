import * as React from 'react';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {FormROProps} from "@/defines/abilities/FormROProps.ts";


interface MyDataListRoProps<V> extends FormROProps<V[]> {
  columns: GridColDef[];
}

/**
 * Data iterations component
 * @param columns
 * @param formData
 * @constructor
 */
const MyDataListRo: React.FC<MyDataListRoProps<any>> = <V, >({
                                                               columns,
                                                               formData
                                                             }: MyDataListRoProps<V>) => {
  return (
    <Paper sx={{width: '100%'}}>
      <DataGrid
        sx={{border: 0}}
        columns={columns}
        rows={formData ?? []}
      />
    </Paper>
  );
}

export default MyDataListRo;