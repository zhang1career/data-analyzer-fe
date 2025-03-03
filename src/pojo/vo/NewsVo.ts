export type NewsTagRelationType = { [key: string]: string };

export interface NewsVo {
  id: number;
  content: string;
  url_id: number;
  url: string;
  published_at: string;
  tags: NewsTagRelationType;
  audited_at: string;
}