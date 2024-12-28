import {MyRouting} from "@/components/hocs/next/MyRouting.ts";
import requestApiHub from "@/io/ApiHubIO.tsx";
import {Paginate} from "@/models/Paginate.ts";
import {TermModel} from "@/models/TermModel.ts";
import {TermVo} from "@/pojo/vo/TermVo.ts";
import {getValueSafely} from "@/utils/ObjUtil.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {AccessVectorVo, GraphVo} from "@/pojo/vo/GraphVo.ts";


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
                                 term: TermModel): Promise<void> {
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
                                 termDto: TermDto): Promise<void> {
  await requestApiHub(
    {
      method: 'PUT',
      url: '/da/knowledge/terms/:termId',
      pathVariable: {
        termId: termId,
      },
      body: termDto,
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

export async function searchGraphVector(context: MyRouting,
                                        termName: string,
                                        relation_type: string): Promise<GraphVo> {
  return await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/term-graph/vectors',
      queryParam: {
        term: termName,
        relation_type: relation_type
      },
      context: context
    }) as Promise<GraphVo>;
}

export async function accessGraphVector(context: MyRouting,
                                        relation_type: string,
                                        is_reverse: boolean): Promise<AccessVectorVo> {
  return await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/term-graph/vector-access',
      queryParam: {
        relation_type: relation_type,
        is_reverse: is_reverse ? 'true' : 'false',
      },
      context: context
    }) as Promise<AccessVectorVo>;
}