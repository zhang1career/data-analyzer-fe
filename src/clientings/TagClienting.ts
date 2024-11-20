import {MyRouting} from "@/adapter/next/MyRouting.ts";
import {Paginate} from "@/models/Paginate.ts";
import requestApiHub from "@/clientings/ApiHubClienting.tsx";
import {getValueSafely} from "@/utils/ObjUtil.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {TagVo} from "@/pojo/vos/TagVo.ts";


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

export async function searchSimilarTagList(tag_like: string): Promise<TagVo[]> {
  const page = await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/tags',
      queryParam: {
        tag_like: tag_like,
        offset: 0,
        count: 10,
      },
    }) as Paginate<TagVo>;

  return page.data;
}

export async function searchSimilarTagNameList(tag_like: string): Promise<string[]> {
  const tagList = await searchSimilarTagList(tag_like);
  return tagList.map((tag) => tag.name);
}