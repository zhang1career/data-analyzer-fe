// todo: rename news to newsList
export interface TagModel {
  id: number;
  name: string;
  news: number[];
  newsCount: number;
}

export function buildEmptyTagModel(): TagModel {
  return {
    id: 0,
    name: '',
    news: [],
    newsCount: 0,
  };
}