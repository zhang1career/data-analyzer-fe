import {GridColDef, GridRowId} from "@mui/x-data-grid";
import React from "react";
import MyConfirmActionItem from "@/components/hocs/mui/datagrids/MyConfirmActionItem.tsx";
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';

export function ColumnAction(on2RowDelete: (rowId: GridRowId) => () => void): GridColDef {

  const activeAt = Date.now();

  return {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    getActions: ({id}) => {
      return [
        <MyConfirmActionItem
          icon={<DeleteIcon/>}
          label={'Delete'}
          showInMenu={false}
          onClick={() => {
            on2RowDelete(id)();
          }}
          dialogTitle={'Delete this item?'}
          dialogContent={'This action cannot be undone.'}
          color="inherit"
          key={`actionDelete-${id}-${activeAt}`}
        />,
      ];
    },
  }
}