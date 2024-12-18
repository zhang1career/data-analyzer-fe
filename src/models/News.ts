// todo: rename all models with 'Model' suffix

export interface News {
  id: number;
  content: string;
  url: string;
  published_at: string;
  tags: string[];
}

export function buildEmptyNews(): News {
  return {
    id: 0,
    content: '',
    url: '',
    published_at: '',
    tags: [],
  }
}