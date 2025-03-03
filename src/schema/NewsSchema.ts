import {GridColDef} from "@mui/x-data-grid";
import MyAutocompleteFilterOperatorFactory from "@/components/hocs/mui/filters/MyAutocompleteFilterOperatorFactory.tsx";
import {searchSimilarTagNameList} from "@/io/TagIO.ts";

export const NEWS_COLUMNS: GridColDef[] = [
  {field: 'id', headerName: 'ID', width: 85, filterable: false},
  {field: 'content', headerName: 'Content', width: 200, filterable: false},
  {field: 'url', headerName: 'URL', width: 150, filterable: false},
  {field: 'published_at', headerName: 'Published At', width: 105, filterable: false},
  {
    field: 'tags', headerName: 'Tags', width: 200, filterable: true,
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
  {field: 'audited_at', headerName: 'Audited At', width: 105, filterable: false},
];

const QUERY_FIELD_MAP: { [key: string]: string } = {}

export function translateQueryField(rawField: string): string {
  return QUERY_FIELD_MAP[rawField] || rawField;
}