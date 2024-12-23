export interface ThinkingDto {
  topic?: string;
  aspect?: string;
  owner?: string;
  filter?: string[];
  thinking: string;
  further?: ThinkingDto[];
}

