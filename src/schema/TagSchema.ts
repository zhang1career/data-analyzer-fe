import {getGridStringOperators, GridColDef} from "@mui/x-data-grid";

export const TAG_COLUMNS: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 85, filterable: false},
  {field: 'name', headerName: 'Name', width: 250, filterable: true,
    filterOperators: getGridStringOperators().filter(op => op.value === 'equals')},
  {field: 'newsCount', headerName: 'News Count', width: 60, filterable: false},
];

export const TAG_COLUMNS_SIMPLE: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 85, filterable: false},
  {field: 'name', headerName: 'Name', width: 250, filterable: true},
];

const TAG_QUERY_FIELD_MAP: { [key: string]: string } = {}

export function translateQueryField(rawField: string): string {
  return TAG_QUERY_FIELD_MAP[rawField] || rawField;
}