import {MyRouting} from "@/adapter/next/MyRouting.ts";
import requestApiHub from "@/client_io/ApiHubIO.tsx";
import {implode} from "@/utils/ArrayUtil.ts";


export async function getMiscDict(context: MyRouting,
                                  dictList: string[],
                                  condDict: { [key: string]: any }): Promise<{ [key: string]: any[] }> {
  return await requestApiHub(
    {
      method: 'GET',
      url: '/da/knowledge/misc/dicts',
      queryParam: {
        names: implode(dictList),
        cond: JSON.stringify(condDict)
      },
      context: context
    }) as Promise<{ [key: string]: any[] }>;
}