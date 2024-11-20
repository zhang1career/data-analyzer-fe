import {getGridStringOperators, GridColDef} from "@mui/x-data-grid";

export const TAG_COLUMNS: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 70, filterable: false},
  {field: 'name', headerName: 'Name', width: 130, filterable: true,
    filterOperators: getGridStringOperators().filter(op => op.value === 'equals')},
];

const TAG_QUERY_FIELD_MAP: { [key: string]: string } = {}

export function translateQueryField(rawField: string): string {
  return TAG_QUERY_FIELD_MAP[rawField] || rawField;
}