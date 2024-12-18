// todo: rename all models with 'Model' suffix

export interface Tag {
  id: number;
  name: string;
  news: number[];
}

export function buildEmptyTag(): Tag {
  return {
    id: 0,
    name: '',
    news: [],
  };
}