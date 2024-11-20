export interface Term {
  id: number;
  name: string;
  content: string;
  relation: TermRelation[];
}

export interface TermRelation {
  name: string;
  relation_type: string;
  is_reverse?: boolean;
}
