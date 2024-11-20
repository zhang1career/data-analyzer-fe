export type NewsTagRelationType = { [key: string]: string };

export interface NewsVo {
  id: number;
  content: string;
  url_id: number;
  published_at: string;
  tags: NewsTagRelationType;
}