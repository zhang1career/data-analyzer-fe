export interface Thinking {
  term?: string;
  mret?: string;

  attribute: string;
  isAttrReverse: boolean;
  predicate: string;
  isPredReverse: boolean;

  owner?: string;
  filter?: string[];

  further?: Thinking[];
}

export function buildEmptyThinking(): Thinking {
  return {
    term: '',
    mret: '',
    attribute: '',
    isAttrReverse: false,
    predicate: '',
    isPredReverse: false,
    further: []
  }
}