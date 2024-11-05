import axios from 'axios';
import {EMPTY_PAGE, Page} from "./Page.ts";
import {getGridStringOperators, GridColDef} from "@mui/x-data-grid";

export interface Term {
  id: number;
  name: string;
  content: string;
  src_term: Map<string, Term>;
  dest_term: Map<string, Term>;
  relate_type: string;
}

export const TERM_COLUMNS: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 70, filterable: false},
  {field: 'name', headerName: 'Name', width: 130, filterable: true,
    filterOperators: getGridStringOperators().filter(op => op.value === 'equals')},
  {field: 'content', headerName: 'Content', width: 130, filterable: false},
];

export const TERM_QUERY_FIELD_MAP: { [key: string]: string } = {
  'name': 'term',
}

export function QueryFieldMap(rawField: string): string {
  return TERM_QUERY_FIELD_MAP[rawField] || rawField;
}

export const ListTermByCond = async (offset: number, count: number, condition?: { [key: string]: string | number }): Promise<Page<Term>> => {
  try {
    const response = await axios.get('http://54.86.102.80:18099/api/knowledge/terms', {
      params: {
        term: condition?.term,
        offset: offset,
        count: count}
    });
    console.log('List term:', response.data.data);
    return response.data.data as Page<Term>;
  } catch (error) {
    console.error('Error listing term:', error);
    return EMPTY_PAGE;
  }
}

export const GetTermById = async (termId: number): Promise<Term> => {
  try {
    const response = await axios.get(`http://54.86.102.80:18099/api/knowledge/terms/${termId}`);
    console.log('Get term:', response.data.data);
    return response.data.data as Term;
  } catch (error) {
    console.error('Error getting term:', error);
    return {} as Term;
  }
}

export interface TermDto {
  name: string;
  content: string;
  relation: RelationDto[];
}

interface RelationDto {
  name: string;
  relation_type: string;
  is_reverse?: boolean;
}

export const CreateTerm = async (termDto: TermDto) => {
  try {
    await axios.post('http://54.86.102.80:18099/api/knowledge/terms', termDto);
    console.log('Create term');
  } catch (error) {
    console.error('Error creating term:', error);
  }
};

export const DeleteTerm = async (termId: number) => {
  try {
    const response = await axios.delete(`http://54.86.102.80:18099/api/knowledge/terms/${termId}`);
    console.log('Delete term:', response.data);
  } catch (error) {
    console.error('Error deleting term:', error);
  }
};