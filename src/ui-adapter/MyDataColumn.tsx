import {GridActionsCellItem, GridColDef, GridRowId} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

export function ColumnAction(handleRowDelete: (rowId: GridRowId) => () => void): GridColDef {
  return {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    getActions: ({id}) => {
      return [
        <GridActionsCellItem
          icon={<DeleteIcon/>}
          label="Delete"
          onClick={handleRowDelete(id)}
          color="inherit"
        />,
      ];
    },
  }
}