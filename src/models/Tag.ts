import axios from 'axios';
import {getGridStringOperators, GridColDef} from "@mui/x-data-grid";

export interface Tag {
  id: number;
  name: string;
  news: number[];
}

export const TAG_COLUMNS: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 70, filterable: false},
  {field: 'name', headerName: 'Name', width: 130, filterable: true,
    filterOperators: getGridStringOperators().filter(op => op.value === 'equals')},
];

export const TAG_QUERY_FIELD_MAP: { [key: string]: string } = {
}

export function QueryFieldMap(rawField: string): string {
  return TAG_QUERY_FIELD_MAP[rawField] || rawField;
}

export const ListTagBySimilar = async (condition?: { [key: string]: string|number }): Promise<Tag[]> => {
  try {
    const response = await axios.get('http://54.86.102.80:18099/api/knowledge/tags/similars', {
      params: {
        tag: condition?.tag}
    });
    console.debug('List tag:', response.data.data);
    return response.data.data as Tag[];
  } catch (error) {
    console.error('Error listing tag:', error);
    return [];
  }
}