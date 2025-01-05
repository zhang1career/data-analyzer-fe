export interface ThinkingDto {
  topic?: string;
  aspect?: string;
  owner?: string;
  filter?: string[];
  thinking: string;
  further?: ThinkingDto[];
}

export function buildEmptyThinkingDto(): ThinkingDto {
  return {
    topic: '',
    aspect: '',
    owner: '',
    filter: [],
    thinking: '',
    further: [],
  }
}