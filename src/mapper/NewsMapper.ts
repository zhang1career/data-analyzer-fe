import {News} from "@/models/News.ts";
import {NewsDto} from "@/pojo/dto/NewsDto.ts";
import {NewsTagRelationType, NewsVo} from "@/pojo/vos/NewsVo.ts";

export function modelToDto(model: News): NewsDto {
  return {
    content: model.content,
    url: model.url,
    published_at: model.published_at,
    tags: Array.from(model.tags.values()).join(','),
  };
}

export function voToModel(vo: NewsVo): News {
  return {
    id: vo.id,
    content: vo.content,
    url: String(vo.url_id),
    published_at: vo.published_at,
    tags: newsTagRelationVoToModel(vo.tags),
  };
}

function newsTagRelationVoToModel(vo: NewsTagRelationType): string[] {
  const tagList: string[] = [];

  Object.values(vo).forEach((value) => {
    tagList.push(value);
  });

  return tagList;
}