import {MyRouting} from "@/adapter/next/MyRouting.ts";
import requestApiHub from "@/clientings/ApiHubClienting.tsx";
import {Paginate} from "@/models/Paginate.ts";
import {Term} from "@/models/Term.ts";
import {TermVo} from "@/pojo/vos/TermVo.ts";
import {getValueSafely} from "@/utils/ObjUtil.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";


export async function searchTermPage(context: MyRouting,
                                     offset: number,
                                     count: number,
                                     condition?: { [key: string]: string | number }): Promise<Paginate<TermVo>> {
  return await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/terms',
      queryParam: {
        term: getValueSafely(condition, 'term', EMPTY_STRING),
        offset: offset,
        count: count,
      },
      context: context,
    }) as Paginate<TermVo>;
}

export async function getTerm(context: MyRouting,
                              termId: number): Promise<TermVo> {
  return await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/terms/:termId',
      pathVariable: {
        termId: termId,
      },
      context: context
    }) as TermVo;
}

export async function createTerm(context: MyRouting,
                                 term: Term): Promise<void> {
  await requestApiHub(
    {
      method: 'POST',
      url: '/da/knowledge/terms',
      body: term,
      context: context
    });
}

export async function updateTerm(context: MyRouting,
                                 termId: number,
                                 term: Term): Promise<void> {
  await requestApiHub(
    {
      method: 'PUT',
      url: '/da/knowledge/terms/:termId',
      pathVariable: {
        termId: termId,
      },
      body: term,
      context: context
    });
}

export async function deleteTerm(context: MyRouting,
                                 termId: number): Promise<void> {
  await requestApiHub(
    {
      method: 'DELETE',
      url: '/da/knowledge/terms/:termId',
      pathVariable: {
        termId: termId,
      },
      context: context
    });
}