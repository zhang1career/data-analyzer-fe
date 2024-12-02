import {MyRouting} from "@/adapter/next/MyRouting.ts";
import {Paginate} from "@/models/Paginate.ts";
import requestApiHub from "@/client_io/ApiHubIO.tsx";
import {getValueSafely} from "@/utils/ObjUtil.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {TagParseResultVo, TagVo} from "@/pojo/vo/TagVo.ts";
import {implode} from "@/utils/ArrayUtil.ts";


export async function searchTagPage(context: MyRouting,
                                    offset: number,
                                    count: number,
                                    condition?: { [key: string]: string | number }): Promise<Paginate<TagVo>> {
  return await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/tags',
      queryParam: {
        tag: getValueSafely(condition, 'tag', EMPTY_STRING),
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