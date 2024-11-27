import {GridColDef} from "@mui/x-data-grid";
import MyAutocompleteFilterOperatorFactory from "@/adapter/mui/filter/MyAutocompleteFilterOperatorFactory.tsx";
import {searchSimilarTagNameList} from "@/client_io/TagIO.ts";

export const NEWS_COLUMNS: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 70, filterable: false},
  {field: 'content', headerName: 'Content', width: 130, filterable: false},
  {field: 'url_id', headerName: 'URL', width: 130, filterable: false},
  {field: 'published_at', headerName: 'Published At', width: 130, filterable: false},
  {
    field: 'tags', headerName: 'Tags', width: 130, filterable: true,
    filterOperators: MyAutocompleteFilterOperatorFactory(
      searchSimilarTagNameList,
      'tags',
      {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        width: 300,
        pl: '20px',
      })
  },
];

const QUERY_FIELD_MAP: { [key: string]: string } = {}

export function translateQueryField(rawField: string): string {
  return QUERY_FIELD_MAP[rawField] || rawField;
}