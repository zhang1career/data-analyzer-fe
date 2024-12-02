export interface ParseTagQo {
  tags: string;
}

export function buildEmptyParseTagQo(): ParseTagQo {
  return {
    tags: '',
  }
}