export interface ThinkingResultVo {
  news_id: number[],
  content: string[],
  refer: {},
  recover_tag: string[],
  thinking: string,
  trace: {[key: string]: string[]},
  score: number
}

export function buildEmptyThinkingResultVo(): ThinkingResultVo {
  return {
    news_id: [],
    content: [],
    refer: {},
    recover_tag: [],
    thinking: '',
    trace: {},
    score: 0
  };
}