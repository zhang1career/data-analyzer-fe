import {getGridStringOperators, GridColDef} from "@mui/x-data-grid";

export const TERM_COLUMNS: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 70, filterable: false},
  {field: 'name', headerName: 'Name', width: 130, filterable: true,
    filterOperators: getGridStringOperators().filter(op => op.value === 'equals')},
  {field: 'content', headerName: 'Content', width: 130, filterable: false},
];

const QUERY_FIELD_MAP: { [key: string]: string } = {
  'name': 'term',
}

export function translateQueryField(rawField: string): string {
  return QUERY_FIELD_MAP[rawField] || rawField;
}