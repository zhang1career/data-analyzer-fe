import {MyRouting} from "@/components/hocs/next/MyRouting.ts";
import requestApiHub from "@/io/ApiHubIO.tsx";
import {WritingAnalysisDto} from "@/pojo/dto/WritingAnalysisDto.ts";
import {WritingSummaryDto} from "@/pojo/dto/WritingSummaryDto.ts";


export async function analysis(context: MyRouting,
                               writingAnalysisDto: WritingAnalysisDto): Promise<string> {
  return await requestApiHub(
    {
      method: 'POST',
      url: '/da/knowledge/writings/analysis',
      body: writingAnalysisDto,
      context: context
    }) as Promise<string>;
}

export async function summary(context: MyRouting,
                              writingSummaryDto: WritingSummaryDto): Promise<string> {
  return await requestApiHub(
    {
      method: 'POST',
      url: '/da/knowledge/writings/summary',
      body: writingSummaryDto,
      context: context
    }) as Promise<string>;
}