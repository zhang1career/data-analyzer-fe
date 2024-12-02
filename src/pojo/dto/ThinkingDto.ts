export interface ThinkingDto {
  topic?: string;
  aspect?: string;
  thinking: string;
  further?: ThinkingDto[];
}

