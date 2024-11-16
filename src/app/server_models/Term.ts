import axios from 'axios';
import {getCookie} from "@/app/server_utils/CookieUtil.ts";
import {ACCESS_TOKEN} from "@/app/server_consts/AccessConst.ts";
import {EMPTY_JSON} from "@/consts/StrConst.ts";
import {Term} from "@/models/Term.ts";

export const TERM_QUERY_FIELD_MAP: { [key: string]: string } = {
  'name': 'term',
}

export function QueryFieldMap(rawField: string): string {
  return TERM_QUERY_FIELD_MAP[rawField] || rawField;
}


export const pageTermByCond = async (offset: number,
                                     count: number,
                                     condition?: { [key: string]: string | number }): Promise<any> => {
  // get access_token
  const token = getCookie(ACCESS_TOKEN);

  try {
    // const apiHost = process.env.API_HOST;
    const apiHost = "http://www.risk-conquer.com/api";
    const response = await axios.get(apiHost + '/da/knowledge/terms', {
      params: {
        term: condition?.term,
        offset: offset,
        count: count
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('List term:', response.data.data);
    return response.data.data; // as Paginate<Term>;
  } catch (error) {
    console.error('Error listing term:', error);
    return EMPTY_JSON;
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