import {MyRouting} from "@/hocs/next/MyRouting.ts";
import requestApiHub from "@/io/ApiHubIO.tsx";
import {ThinkingDto} from "@/pojo/dto/ThinkingDto.ts";
import {ThinkingResultVo} from "@/pojo/vo/ThinkingResultVo.ts";


export async function createThinking(context: MyRouting,
                                     thinkingDto: ThinkingDto): Promise<{ [key: string]: ThinkingResultVo }> {
  return await requestApiHub(
    {
      method: 'POST',
      url: '/da/knowledge/thinkings',
      body: thinkingDto,
      context: context
    }) as Promise<{ [key: string]: ThinkingResultVo }>;
}