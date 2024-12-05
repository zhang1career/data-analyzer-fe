'use client';

import React, {FC, useContext, useEffect, useState} from "react";
import MyDropdownList from "@/adapter/mui/MyDropdownList.tsx";
import MySearchBar from "@/adapter/mui/MySearchBar.tsx";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {ObjMap} from "@/components/helpers/ObjMap.ts";
import TermRelation from "@/clientings/term/TermRelation.tsx";
import {getTerm, searchTermGraph} from "@/client_io/TermIO.ts";
import {parseTag} from "@/client_io/TagIO.ts";
import {getMiscDict} from "@/client_io/MiscIO.ts";
import {voToModel} from "@/mappers/TermGraphMapper.ts";
import {speechVectorVoToMapBatch} from "@/mappers/SpeechMapper.ts";
import {parseResultVoToTermMretOptBatch} from "@/mappers/TagMapper.ts";
import {buildEmptyNews, News} from "@/models/News.ts";
import {TermGraph} from "@/models/Term.ts";
import {Thinking} from "@/models/Thinking.ts";
import {TermMretOpt} from "@/pojo/opt/TermMretOpt.ts";
import {buildEmptySearchTermGraphQo, SearchTermGraphQo} from "@/pojo/qo/TermQo.ts";
import {buildEmptyParseTagQo, ParseTagQo} from "@/pojo/qo/TagQo.ts";
import {TermVo} from "@/pojo/vo/TermVo.ts";
import {GraphNodeVo, SpeechVectorVo, SpeechVo} from "@/pojo/vo/SpeechVo.ts";
import {TEXTBOX_WIDTH_MIN_PX} from "@/lookings/size.ts";
import ThinkingCreate from "@/clientings/thinking/ThinkingCreate.tsx";
import {DICT_SPEECH_VECTOR} from "@/consts/Misc.ts";
import {GraphPath} from "@/models/GraphPath.ts";
import MyStepper from "@/adapter/mui/MyStepper.tsx";
import {COLOR} from "@/lookings/color.ts";
import {SpeechVectorKey} from "@/pojo/map/SpeechVectorMap.ts";
import {ThinkingResultNewsTitleMap} from "@/models/ThinkingResult.ts";


interface NewsAuditProps {
  formData?: News;
}

function buildTerm(searchTermGraphQo: SearchTermGraphQo, graphNodeVoList: GraphNodeVo[]): TermVo {
  // prepare data
  // name
  const name = searchTermGraphQo['name'];
  // id
  let id = 0;
  for (const graphNodeVo of graphNodeVoList) {
    if (graphNodeVo.l === name) {
      id = graphNodeVo.id;
      break;
    }
  }

  return {
    id: id,
    name: name,
    content: '',
    src_term: new Map(),
    dest_term: new Map(),
    r: new Map(),
  };
}

const NewsAudit: FC<NewsAuditProps> = ({
                                         formData = buildEmptyNews()
                                       }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // prepare data
  // graph vector map
  const [speechVectorMap, setSpeechVectorMap] = useState<ObjMap<SpeechVectorKey, string>>(new ObjMap());

  useEffect(() => {
    const miscDictPromise = getMiscDict(
      routing,
      [DICT_SPEECH_VECTOR],
      {});
    miscDictPromise.then((miscDict) => {
      const speechVectorVoList = miscDict[DICT_SPEECH_VECTOR] as SpeechVectorVo[];
      setSpeechVectorMap(speechVectorVoToMapBatch(speechVectorVoList));
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

  // function
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
    if (!searchTermGraphQo['name'] || !searchTermGraphQo['relation_type']) {
      console.debug('[news][audit][term_graph][skip] No search term graph qo specified:', searchTermGraphQo);
      return;
    }
    console.debug('[news][audit][term_graph] param', searchTermGraphQo, thinking);

    const termGraphVo = await searchTermGraph(
      routing,
      searchTermGraphQo['name'],
      searchTermGraphQo['relation_type']) as SpeechVo;
    setSelectedTerm(buildTerm(searchTermGraphQo, termGraphVo.nodes));
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

  // operation - travel path
  const [graphPathMap, setGraphPathMap] = useState<Map<string, GraphPath> | null>(null);

  function handleSetTravelPath(graphPath: GraphPath) {
    console.debug('[news][audit][path] Set travel path:', graphPath);
    if (!graphPathMap) {
      setGraphPathMap(new Map([[graphPath.id, graphPath]]));
      return;
    }
    setGraphPathMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(graphPath.id, graphPath);
      return newMap;
    });
  }

  useEffect(() => {
    console.info('[news][audit][vector] param:', graphPathMap);

    const len = graphPathMap?.size;
    if (!len || len <= 1) {
      console.info('[news][audit][vector][skip] No path to think.');
      return;
    }

    let attrPath: GraphPath | undefined;
    let predPath: GraphPath | undefined;
    for (const [_path_id, _path] of graphPathMap) {
      if (!attrPath) {
        attrPath = _path;
        continue;
      }
      if (!predPath) {
        predPath = _path;
        break;
      }
    }
    if (!attrPath || !predPath) {
      console.info('[news][audit][vector][skip] Invalid path to think.');
      return;
    }

    console.info('[news][audit][vector] setThinking:', attrPath, predPath);
    setThinking({
      ...thinking,
      attribute: attrPath.label,
      isAttrReverse: attrPath.isReverse,
      predicate: predPath.label,
      isPredReverse: predPath.isReverse,
    });
  }, [graphPathMap]);

  // build thinking
  const [thinking, setThinking] = useState<Thinking | null>(null);

  // thinking result
  const [newsTitleMap, setNewsTitleMap] = useState<ThinkingResultNewsTitleMap | null>(null);

  return (
    <MyStepper
      sx={{backgroundColor: COLOR.light_yellow}}
    >
      <MySearchBar
        title={'choose a tag as subject'}
        onSetFormData={setParseTagQo}
        onClick={handleParseTag}
        isAutoSubmit={true}
        isNextEnabled={!!termMretOpts}
      >
        <MyDropdownList
          id={'subject_tag'}
          label={'subject'}
          name={'tags'}
          value={parseTagQo['tags']}
          options={formData['tags']}
          sx={{width: TEXTBOX_WIDTH_MIN_PX}}
        />
      </MySearchBar>

      <MySearchBar
        title={'choose term-mret and predicate'}
        onSetFormData={setSearchTermGraphQo}
        onClick={handleSearchTermGraph}
        isAutoSubmit={true}
        isNextEnabled={!!termGraph}
      >
        <MyDropdownList
          id={'term_mret'}
          label={'term - mret'}
          name={'term_mret'}
          value={searchTermGraphQo['term_mret']}
          options={termMretOpts}
          sx={{width: TEXTBOX_WIDTH_MIN_PX}}
        />
        <MyDropdownList
          id={'predicate_relation'}
          label={'predicate relation'}
          name={'relation_type'}
          value={searchTermGraphQo['relation_type']}
          options={formData['tags']}
          sx={{width: TEXTBOX_WIDTH_MIN_PX}}
        />
      </MySearchBar>

      <TermRelation
        title={'select speech vectors on graph'}
        item={selectedTerm}
        graph={termGraph}
        onDetailNode={handleDetail}
        onTravelPath={handleSetTravelPath}
        isNextEnabled={!!thinking?.attribute && !!thinking?.predicate}
        key={activeAuditAt}
      />

      <ThinkingCreate
        title={'thinking'}
        formData={thinking}
        onSetFormData={setThinking}
        speechVectorMap={speechVectorMap}
        onSetResultData={setNewsTitleMap}
        isNextEnabled={!!newsTitleMap && !!formData && newsTitleMap.has(formData.id)}
      />
    </MyStepper>
  );
}

export default NewsAudit;