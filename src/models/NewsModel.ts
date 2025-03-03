export interface NewsModel {
  id: number;
  content: string;
  url: string;
  published_at: string;
  tags: string[];
  audited_at: string;
}

export function buildEmptyNews(): NewsModel {
  return {
    id: 0,
    content: '',
    url: '',
    published_at: '',
    tags: [],
    audited_at: '',
  }
}