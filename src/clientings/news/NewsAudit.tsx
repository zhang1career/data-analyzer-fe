'use client';

import React, {useContext, useState} from "react";
import {TermGraph, TermGraphSearch} from "@/models/Term.ts";
import MySearchBar from "@/adapter/mui/MySearchBar.tsx";
import {InputBase} from "@mui/material";
import MyDropdownList from "@/adapter/mui/MyDropdownList.tsx";
import {getTerm, searchTermGraph} from "@/client_io/TermIO.ts";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {GraphVo} from "@/pojo/vos/GraphVo.ts";
import {voToModel} from "@/mapper/TermGraphMapper.ts";
import TermRelation from "@/clientings/term/TermRelation.tsx";
import {News} from "@/models/News.ts";
import {buildEmptyFormData, buildEmptyQueryParam} from "@/clientings/news/NewsBase.tsx";

interface NewsAuditProps {
  formData?: News;
}

const NewsAudit: React.FC<NewsAuditProps> = ({
                                               formData = buildEmptyFormData()
                                             }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // query param
  const [queryParam, setQueryParam] = useState<TermGraphSearch>(buildEmptyQueryParam());

  // query result
  const [termGraph, setTermGraph] = useState<TermGraph | null>(null);

  const handleSearch = async () => {
    const termGraphVo = await searchTermGraph(
      routing,
      queryParam['name'],
      queryParam['relation_type']) as GraphVo;
    setTermGraph(voToModel(termGraphVo));
  }

  // operation - detail an item
  const handleDetail = async (termId: number) => {
    try {
      return await getTerm(
        routing,
        termId);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to get term.\n', e.message);
      } else {
        console.error('Failed to get term.\n', e);
      }
      return null;
    }
  }

  return (
    <div>
      <MySearchBar
        onSetFormData={setQueryParam}
        onSubmit={handleSearch}>
        <InputBase
          id={'name'}
          name={'name'}
          value={queryParam['name']}
          placeholder={'term...'}
          autoComplete='off'
        />
        <MyDropdownList
          id={'relation_type'}
          label={'relation_type'}
          name={'relation_type'}
          value={queryParam['relation_type']}
          options={formData['tags']}/>
      </MySearchBar>

      {termGraph && (
        <TermRelation graph={termGraph} onDetail={handleDetail}/>
      )}
    </div>
  );
}

export default NewsAudit;