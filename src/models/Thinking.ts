export interface Thinking {
  term?: string;
  mret?: string;

  attribute: string;
  isAttrReverse: boolean;
  predicate: string;
  isPredReverse: boolean;

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