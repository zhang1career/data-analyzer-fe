export interface Page<T> {
  data: T[];
  total_num: number;
}

export const EMPTY_PAGE = {data: [], total_num: 0};