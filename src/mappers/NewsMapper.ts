import {NewsModel} from "@/models/NewsModel.ts";
import {NewsDto} from "@/pojo/dto/NewsDto.ts";
import {NewsTagRelationType, NewsVo} from "@/pojo/vo/NewsVo.ts";

export function modelToDto(model: NewsModel): NewsDto {
  return {
    content: model.content,
    url: model.url,
    published_at: model.published_at,
    tags: Array.from(model.tags.values()).join(','),
    audited_at: model.audited_at,
  };
}

export function voToModel(vo: NewsVo): NewsModel {
  return {
    id: vo.id,
    content: vo.content,
    url: vo.url,
    published_at: vo.published_at,
    tags: newsTagRelationVoToModel(vo.tags),
    audited_at: vo.audited_at,
  };
}

export function voToModelBatch(voList: NewsVo[]): NewsModel[] {
  const newsList = [];
  for (const vo of voList) {
    newsList.push(voToModel(vo));
  }
  return newsList;
}

function newsTagRelationVoToModel(vo: NewsTagRelationType): string[] {
  const tagList: string[] = [];

  Object.values(vo).forEach((value) => {
    tagList.push(value);
  });
  return tagList;
}