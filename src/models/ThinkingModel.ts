export interface ThinkingModel {
  term?: string;
  mret?: string;

  attribute: string;
  isAttrReverse: boolean;
  predicate: string;
  isPredReverse: boolean;

  owner?: string;
  filter?: string[];

  children?: ThinkingModel[];
}

export function buildEmptyThinking(): ThinkingModel {
  return {
    term: '',
    mret: '',
    attribute: '',
    isAttrReverse: false,
    predicate: '',
    isPredReverse: false,
    children: []
  }
}