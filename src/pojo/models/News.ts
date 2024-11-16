import axios from 'axios';
import {Paginate} from "./Paginate.ts";
import {GridColDef} from "@mui/x-data-grid";
import {Implode} from "../utils/ArrayUtil.ts";
import AutocompleteTagFilterOperators from "../components/filter/AutocompleteTagFilterOperators.tsx";
import {EMPTY_PAGINATE} from "@/app/server_consts/PaginateConst.ts";

export interface News {
  id: number;
  content: string;
  url_id: number;
  published_at: string;
  tags: Map<string, string>;
}

export const NEWS_COLUMNS: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 70, filterable: false},
  {field: 'content', headerName: 'Content', width: 130, filterable: false},
  {field: 'url_id', headerName: 'URL', width: 130, filterable: false},
  {field: 'published_at', headerName: 'Published At', width: 130, filterable: false},
  {field: 'tags', headerName: 'Tags', width: 130, filterable: true,
    filterOperators: AutocompleteTagFilterOperators},
];

export const NEWS_QUERY_FIELD_MAP: { [key: string]: string } = {}

export function QueryFieldMap(rawField: string): string {
  return NEWS_QUERY_FIELD_MAP[rawField] || rawField;
}

export const ListNewsByCond = async (offset: number, count: number, condition?: { [key: string]: string | number }): Promise<Paginate<News>> => {
  try {
    const response = await axios.get('http://54.86.102.80:18099/api/knowledge/news', {
      params: {
        tags: condition?.tags,
        offset: offset,
        count: count
      }
    });
    console.debug('List news:', response.data.data);
    return response.data.data as Paginate<News>;
  } catch (error) {
    console.error('Error listing news:', error);
    return EMPTY_PAGINATE;
  }
}

export const GetNewsById = async (newsId: number): Promise<News> => {
  try {
    const response = await axios.get(`http://54.86.102.80:18099/api/knowledge/news/${newsId}`);
    console.log('Get news:', response.data.data);
    return response.data.data as News;
  } catch (error) {
    console.error('Error getting news:', error);
    return {} as News;
  }
}

export interface NewsCreateQo {
  content: string;
  tagList: string[];
  url: string;
  publishedAt: string;
}

export interface NewsUpdateQo {
  id: number;
  content: string;
  tagList: string[];
}

export interface NewsDto {
  content: string;
  tags: string;
  url?: string;
  published_at?: string;
}

export const CreateNews = async (newsQo: NewsCreateQo) => {
  try {
    const newsDto: NewsDto = {
      content: newsQo.content,
      tags: Implode(newsQo.tagList.map((tag) => tag.trim())),
      url: newsQo.url,
      published_at: newsQo.publishedAt,
    };
    await axios.post('http://54.86.102.80:18099/api/knowledge/news', newsDto);
    console.log('Create news');
  } catch (error) {
    console.error('Error creating news:', error);
  }
};

export const UpdateNews = async (newsQo: NewsUpdateQo) => {
  try {
    const newsDto: NewsDto = {
      content: newsQo.content,
      tags: Implode(newsQo.tagList.map((tag) => tag.trim())),
    };
    const response = await axios.put(`http://54.86.102.80:18099/api/knowledge/news/${newsQo.id}`, newsDto);
    console.log('Update news:', response.data);
  } catch (error) {
    console.error('Error updating news:', error);
  }
};

export const DeleteNews = async (newsId: number) => {
  try {
    const response = await axios.delete(`http://54.86.102.80:18099/api/knowledge/news/${newsId}`);
    console.log('Delete news:', response.data);
  } catch (error) {
    console.error('Error deleting news:', error);
  }
};