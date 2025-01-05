export interface SearchTermGraphQo {
  name: string;
  relation_type: string;
  is_reverse?: boolean;
  // intermediate properties
  term_mret?: string;
}

export function buildEmptySearchTermGraphQo(): SearchTermGraphQo {
  return {
    name: '',
    relation_type: '',
    is_reverse: false,
  }
}