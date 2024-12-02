import {News} from "@/models/News.ts";

export function buildEmptyFormData(): News {
  return {
    id: 0,
    content: '',
    url: '',
    published_at: '',
    tags: [],
  }
}
