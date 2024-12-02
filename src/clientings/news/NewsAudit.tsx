'use client';

import React, {useContext, useEffect, useState} from "react";
import {Checkbox} from "@mui/material";
import MyDropdownList from "@/adapter/mui/MyDropdownList.tsx";
import MySearchBar from "@/adapter/mui/MySearchBar.tsx";
import MyTextField from "@/adapter/mui/MyTextField.tsx";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {ObjMap} from "@/components/helpers/ObjMap.ts";
import TermRelation from "@/clientings/term/TermRelation.tsx";
import {buildEmptyFormData} from "@/clientings/news/NewsBase.tsx";
import {getTerm, searchTermGraph} from "@/client_io/TermIO.ts";
import {parseTag} from "@/client_io/TagIO.ts";
import {createThinking} from "@/client_io/ThinkingIO.ts";
import {getMiscDict} from "@/client_io/MiscIO.ts";
import {voToModel} from "@/mappers/TermGraphMapper.ts";
import {graphVectorVoToMapBatch} from "@/mappers/GraphMapper.ts";
import {parseResultVoToTermMretOptBatch} from "@/mappers/TagMapper.ts";
import {modelToDto} from "@/mappers/ThinkingMapper.ts";
import {News} from "@/models/News.ts";
import {TermGraph} from "@/models/Term.ts";
import {Thinking} from "@/models/Thinking.ts";
import {GraphVectorType} from "@/pojo/map/GraphVectorMap.ts";
import {TermMretOpt} from "@/pojo/opt/TermMretOpt.ts";
import {buildEmptySearchTermGraphQo, SearchTermGraphQo} from "@/pojo/qo/TermQo.ts";
import {buildEmptyParseTagQo, ParseTagQo} from "@/pojo/qo/TagQo.ts";
import {newTermVo, TermVo} from "@/pojo/vo/TermVo.ts";
import {GraphVectorVo, GraphVo} from "@/pojo/vo/GraphVo.ts";
import {ThinkingResultVo} from "@/pojo/vo/ThinkingVo.ts";
import {TEXTBOX_WIDTH_MIN_PX} from "@/lookings/size.ts";


interface NewsAuditProps {
  formData?: News;
}

const NewsAudit: React.FC<NewsAuditProps> = ({
                                               formData = buildEmptyFormData()
                                             }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // prepare data
  // graph vector map
  const [graphVectorMap, setGraphVectorMap] = useState<ObjMap<GraphVectorType, string>>(new ObjMap());

  useEffect(() => {
    const miscDictPromise = getMiscDict(
      routing,
      ['graph_vector'],
      {});
    miscDictPromise.then((miscDict) => {
      const graphVectorVoList = miscDict['graph_vector'] as GraphVectorVo[];
      setGraphVectorMap(graphVectorVoToMapBatch(graphVectorVoList));
    });
  }, []);

  // query param
  const [parseTagQo, setParseTagQo] = useState<ParseTagQo>(buildEmptyParseTagQo());

  const [termMretOpts, setTermMretOpts] = useState<TermMretOpt[] | null>(null);

  const [searchTermGraphQo, setSearchTermGraphQo] = useState<SearchTermGraphQo>(buildEmptySearchTermGraphQo());

  // data mapping
  useEffect(() => {
    if (!termMretOpts) {
      return;
    }

    // when name is selected, set the term and mret to the search qo
    let term = '';
    let mret: string | undefined = undefined;
    for (const _termMretOpt of termMretOpts) {
      if (_termMretOpt.value === searchTermGraphQo.term_mret) {
        term = _termMretOpt.term;
        mret = _termMretOpt.mret;
      }
    }

    setSearchTermGraphQo({
      ...searchTermGraphQo,
      name: term,
    });

    if (!thinking) {
      setThinking({
        isAttrReverse: false,
        isPredReverse: false,
        term: term,
        mret: mret,
      } as Thinking);
    } else {
      setThinking({
        ...thinking,
        term: term,
        mret: mret,
      });
    }
  }, [searchTermGraphQo.term_mret]);

  // item refreshment
  const [activeAuditAt, setActiveAuditAt] = useState(Date.now());

  function refreshRelation() {
    setActiveAuditAt(Date.now());
  }

  // parse tag
  const handleParseTag = async () => {
    if (!parseTagQo['tags']) {
      throw new Error('[news][audit] No tags to parse.');
    }
    const parseResultVoList = await parseTag(
      routing,
      parseTagQo['tags']);
    const termMretOpts = parseResultVoToTermMretOptBatch(parseResultVoList);
    setTermMretOpts(termMretOpts);
  }

  // query term graph
  const [selectedTerm, setSelectedTerm] = useState<TermVo | null>(null);
  const [termGraph, setTermGraph] = useState<TermGraph | null>(null);

  const handleSearchTermGraph = async () => {
    console.log('[news][audit] search term graph', searchTermGraphQo, thinking);
    const termVo = newTermVo(searchTermGraphQo['name']);
    const termGraphVo = await searchTermGraph(
      routing,
      searchTermGraphQo['name'],
      searchTermGraphQo['relation_type']) as GraphVo;
    setSelectedTerm(termVo);
    setTermGraph(voToModel(termGraphVo));
    refreshRelation();
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

  // build thinking
  const [thinking, setThinking] = useState<Thinking | null>(null);

  // create thinking
  const [thinkingResult, setThinkingResult] = useState<ThinkingResultVo | null>(null);

  // operation - create
  const handleCreateThinking = async () => {
    if (!thinking) {
      throw new Error('[news][audit] No thinking form specified.');
    }
    const thinkingDto = modelToDto(thinking, graphVectorMap);
    console.info('[thinking][create] param', thinkingDto);
    const thinkingResultObj = await createThinking(
      routing,
      thinkingDto);
    if (!thinkingResultObj) {
      throw new Error('[news][audit] No thinking result returned.');
    }
    Object.entries(thinkingResultObj).forEach(([key, value]) => {
      setThinkingResult(value);
    });
    // notice
    noticing('Thinking created!', {
      severity: 'success',
      autoHideDuration: 3000,
    });
  };

  return (
    <div>
      <MySearchBar
        onSetFormData={setParseTagQo}
        onSubmit={handleParseTag}
        isAutoSubmit={true}>
        <MyDropdownList
          id={'subject_tag'}
          label={'tag_subject_tag'}
          name={'tags'}
          value={parseTagQo['tags']}
          options={formData['tags']}
          sx={{width: TEXTBOX_WIDTH_MIN_PX}}
        />
      </MySearchBar>

      {termMretOpts && (
        <MySearchBar
          onSetFormData={setSearchTermGraphQo}
          onSubmit={handleSearchTermGraph}>

          <MyDropdownList
            id={'term_mret'}
            label={'term_mret'}
            name={'term_mret'}
            value={searchTermGraphQo['term_mret']}
            options={termMretOpts}
          />

          <MyDropdownList
            id={'relation_type'}
            label={'relation_type'}
            name={'relation_type'}
            value={searchTermGraphQo['relation_type']}
            options={formData['tags']}
          />
        </MySearchBar>
      )}

      {termGraph && (
        <TermRelation
          item={selectedTerm}
          graph={termGraph}
          onDetail={handleDetail}
          key={activeAuditAt}
        />
      )}

      {termGraph && thinking && (
        <MySearchBar
          onSetFormData={setThinking}
          onSubmit={handleCreateThinking}>

          <MyTextField
            id={'attribute'}
            label={'attribute'}
            name={'attribute'}
            value={thinking['attribute']}
            isEditable={true}
          />
          <Checkbox
            id={'isAttrReverse'}
            name={'isAttrReverse'}
            checked={thinking['isAttrReverse']}
          />
          <MyTextField
            id={'predicate'}
            label={'predicate'}
            name={'predicate'}
            value={thinking['predicate']}
            isEditable={true}
          />
          <Checkbox
            id={'isPredReverse'}
            name={'isPredReverse'}
            checked={thinking['isPredReverse']}
          />
        </MySearchBar>
      )}

      {thinkingResult && (
        <div>
          <p>news_id: {thinkingResult.news_id}</p>
          <p>content: {thinkingResult.content}</p>
          <p>refer: {JSON.stringify(thinkingResult.refer)}</p>
          <p>recover_tag: {thinkingResult.recover_tag}</p>
          <p>thinking: {thinkingResult.thinking}</p>
          <p>trace: {JSON.stringify(thinkingResult.trace)}</p>
          <p>score: {thinkingResult.score}</p>
        </div>
      )}
    </div>
  );
}

export default NewsAudit;