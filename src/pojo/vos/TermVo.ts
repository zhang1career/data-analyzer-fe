export interface TermVo {
  id: number;
  name: string;
  content: string;
  src_term: Map<string, TermVo>;
  dest_term: Map<string, TermVo>;
  relate_type: string;
}