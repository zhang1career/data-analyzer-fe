export interface ThinkingResultVo {
  news_id: number[],
  content: string[],
  refer: {},
  recover_tag: string[],
  thinking: string,
  trace: {[key: string]: string[]},
  score: number
}