import {News} from "@/models/News.ts";
import {TermGraphSearch} from "@/models/Term.ts";

export function buildEmptyQueryParam(): TermGraphSearch {
  return {
    name: '',
    relation_type: '',
    is_reverse: false,
  }
}

export function buildEmptyFormData(): News {
  return {
    id: 0,
    content: '',
    url: '',
    published_at: '',
    tags: [],
  }
}
