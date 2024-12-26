import {MyRouting} from "@/hocs/next/MyRouting.ts";
import {Paginate} from "@/models/Paginate.ts";
import requestApiHub from "@/io/ApiHubIO.tsx";
import {getValueSafely} from "@/utils/ObjUtil.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {TagParseResultVo, TagVo} from "@/pojo/vo/TagVo.ts";
import {implode} from "@/utils/ArrayUtil.ts";
import {TagModel} from "@/models/TagModel.ts";


export async function searchTagPage(context: MyRouting,
                                    offset: number,
                                    count: number,
                                    condition?: { [key: string]: string | number }): Promise<Paginate<TagVo>> {
  return await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/tags',
      queryParam: {
        tag_like: getValueSafely(condition, 'name', EMPTY_STRING),
        offset: offset,
        count: count,
      },
      context: context,
    }) as Paginate<TagVo>;
}

async function searchSimilarTagList(tagLike: string): Promise<TagVo[]> {
  const page = await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/tags',
      queryParam: {
        tag_like: tagLike,
        offset: 0,
        count: 10,
      },
    }) as Paginate<TagVo>;

  return page.data;
}

export async function searchSimilarTagNameList(tagLike: string): Promise<string[]> {
  const tagList = await searchSimilarTagList(tagLike);
  return tagList.map((tag) => tag.name);
}

export async function getTag(context: MyRouting,
                             tagId: number): Promise<TagVo> {
  return await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/tags/:tagId',
      pathVariable: {
        tagId: tagId,
      },
      context: context
    }) as TagVo;
}

export async function updateTag(context: MyRouting,
                                tagId: number,
                                tag: TagModel): Promise<void> {
  await requestApiHub(
    {
      method: 'PUT',
      url: '/da/knowledge/tags/:tagId',
      pathVariable: {
        tagId: tagId,
      },
      body: tag,
      context: context
    });
}

export async function deleteTag(context: MyRouting,
                                tagId: number): Promise<void> {
  await requestApiHub(
    {
      method: 'DELETE',
      url: '/da/knowledge/tags/:tagId',
      pathVariable: {
        tagId: tagId,
      },
      context: context
    });
}

export async function parseTag(context: MyRouting,
                               tagList: string): Promise<TagParseResultVo[]> {
  return await requestApiHub(
    {
      method: 'POST',
      url: '/da/knowledge/tag-parses',
      body: {
        tags: implode([tagList]),
      },
      context: context
    }) as TagParseResultVo[];
}