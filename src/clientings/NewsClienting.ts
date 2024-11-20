import {MyRouting} from "@/adapter/next/MyRouting.ts";
import {Paginate} from "@/models/Paginate.ts";
import {NewsDto} from "@/pojo/dto/NewsDto.ts";
import requestApiHub from "@/clientings/ApiHubClienting.tsx";
import {getValueSafely} from "@/utils/ObjUtil.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {NewsVo} from "@/pojo/vos/NewsVo.ts";


export async function searchNewsPage(context: MyRouting,
                                     offset: number,
                                     count: number,
                                     condition?: { [key: string]: string | number }): Promise<Paginate<NewsVo>> {
  return await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/news',
      queryParam: {
        tags: getValueSafely(condition, 'tags', EMPTY_STRING),
        offset: offset,
        count: count,
      },
      context: context,
    }) as Paginate<NewsVo>;
}

export async function getNews(context: MyRouting,
                              newsId: number): Promise<NewsVo> {
  return await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/news/:newsId',
      pathVariable: {
        newsId: newsId,
      },
      context: context
    }) as NewsVo;
}

export async function createNews(context: MyRouting,
                                 newsDto: NewsDto): Promise<void> {
  await requestApiHub(
    {
      method: 'POST',
      url: '/da/knowledge/news',
      body: newsDto,
      context: context
    });
}

export async function updateNews(context: MyRouting,
                                 newsId: number,
                                 newsDto: NewsDto): Promise<void> {
  await requestApiHub(
    {
      method: 'PUT',
      url: '/da/knowledge/news/:newsId',
      pathVariable: {
        newsId: newsId,
      },
      body: newsDto,
      context: context
    });
}

export async function deleteNews(context: MyRouting,
                                 newsId: number): Promise<void> {
  await requestApiHub(
    {
      method: 'DELETE',
      url: '/da/knowledge/news/:newsId',
      pathVariable: {
        newsId: newsId,
      },
      context: context
    });
}