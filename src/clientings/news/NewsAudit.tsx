'use client';

import React, {useContext, useEffect, useState} from "react";
import {RoutingContext} from "@/components/providers/RoutingProvider.tsx";
import {NoticingContext} from "@/components/providers/NoticingProvider.tsx";
import {ObjMap} from "@/defines/structures/ObjMap.ts";
import TermGraph from "@/clientings/term/TermGraph.tsx";
import ThinkingCreate from "@/clientings/thinking/ThinkingCreate.tsx";
import {getTerm, searchGraphVector} from "@/io/TermIO.ts";
import {parseTag} from "@/io/TagIO.ts";
import {getMiscDict} from "@/io/MiscIO.ts";
import {voToModel as termGraphVoToModel} from "@/mappers/TermGraphMapper.ts";
import {termRelationOptToTermRelationModel, voToModel as termVoToModel} from "@/mappers/TermMapper.ts";
import {speechVectorVoToMapBatch} from "@/mappers/SpeechMapper.ts";
import {parseResultVoToTermMretOptBatch} from "@/mappers/TagMapper.ts";
import {buildEmptyNews, News} from "@/models/News.ts";
import {GraphPath, metaEqual} from "@/models/GraphPath.ts";
import {TermGraphModel, TermModel} from "@/models/TermModel.ts";
import {ThinkingModel} from "@/models/ThinkingModel.ts";
import {ThinkingResultNewsTitleMap} from "@/models/ThinkingResult.ts";
import {TermMretOpt} from "@/pojo/opt/TermMretOpt.ts";
import {buildEmptySearchTermGraphQo, SearchTermGraphQo} from "@/pojo/qo/TermQo.ts";
import {buildEmptyParseTagQo, ParseTagQo} from "@/pojo/qo/TagQo.ts";
import {SpeechVectorKey} from "@/pojo/map/SpeechVectorMap.ts";
import {GraphNodeVo, GraphVectorVo, GraphVo} from "@/pojo/vo/GraphVo.ts";
import {DICT_SPEECH_ATTR, DICT_SPEECH_PRED, DICT_SPEECH_VECTOR} from "@/consts/Misc.ts";
import ParsingTagSearchBar from "@/components/repos/tag/ParsingTagSearchBar.tsx";
import TermGraphSearchBar from "@/components/repos/term/TermGraphSearchBar.tsx";
import {checkEmpty, checkEmpty as ArrayUtil_checkEmpty} from "@/utils/ArrayUtil.ts";
import {checkEmpty as SetUtil_checkEmpty} from "@/utils/SetUtil.ts"
import {DictVo} from "@/pojo/vo/misc/DictVo.ts";
import {dictVoToSetBatch} from "@/mappers/misc/DictMapper.ts";
import TermCreateDrawer from "@/clientings/term/TermCreateDrawer.tsx";
import TermAccessVector from "@/components/repos/term/TermAccessVector.tsx";
import {TermRelationOpt} from "@/pojo/opt/TermRelationOpt.ts";
import {StyledMuiAuthorityStepper} from "@/components/styled/steppers/StyledMuiStepper.tsx";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {NOTICE_TTL_LONG} from "@/consts/Notice.ts";


interface NewsAuditProps {
  formData?: News;
}

const NewsAudit: React.FC<NewsAuditProps> = ({
                                               formData = buildEmptyNews()
                                             }) => {
  // context
  const routing = useContext(RoutingContext);
  const noticing = useContext(NoticingContext);

  // error
  const [error, setError] = useState<any>(null);
  // notice error
  useEffect(() => {
    if (!error) {
      return;
    }
    noticing(error, {
      severity: 'error',
      autoHideDuration: NOTICE_TTL_LONG,
    });
  }, [error, noticing]);

  // prepare inputs
  // graph vector map
  const [speechVectorMap, setSpeechVectorMap] = useState<ObjMap<SpeechVectorKey, string>>(new ObjMap());
  const [attrSet, setAttrSet] = useState<Set<string> | null>(null);
  const [predSet, setPredSet] = useState<Set<string> | null>(null);

  useEffect(() => {
    const miscDictPromise = getMiscDict(
      routing,
      [DICT_SPEECH_VECTOR, DICT_SPEECH_ATTR, DICT_SPEECH_PRED],
      {});
    miscDictPromise.then((miscDict) => {
      const speechVectorVoList = miscDict[DICT_SPEECH_VECTOR] as GraphVectorVo[];
      setSpeechVectorMap(speechVectorVoToMapBatch(speechVectorVoList));
      const speechAttrVoList = miscDict[DICT_SPEECH_ATTR] as DictVo[];
      setAttrSet(dictVoToSetBatch(speechAttrVoList));
      const speechPredVoList = miscDict[DICT_SPEECH_PRED] as DictVo[];
      setPredSet(dictVoToSetBatch(speechPredVoList));
    });
  }, [routing]);

  // query param
  const [parseTagQo, setParseTagQo] = useState<ParseTagQo | null>(buildEmptyParseTagQo());
  const [termMretOpts, setTermMretOpts] = useState<TermMretOpt[] | null>(null);
  const [searchTermGraphQo, setSearchTermGraphQo] = useState<SearchTermGraphQo | null>(buildEmptySearchTermGraphQo());
  // actives
  const [activeTermGraphSearchAt, setActiveTermGraphSearchAt] = useState<number | null>(null);

  // inputs mapping
  useEffect(() => {
    if (!termMretOpts || !searchTermGraphQo) {
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
    //
    setSearchTermGraphQo({
      ...searchTermGraphQo,
      name: term,
    });
    //
    if (!thinking) {
      setThinking({
        isAttrReverse: false,
        isPredReverse: false,
        term: term,
        mret: mret,
      } as ThinkingModel);
    } else {
      setThinking({
        ...thinking,
        term: term,
        mret: mret,
      });
    }
    // active term graph search
    setActiveTermGraphSearchAt(Date.now());
  }, [searchTermGraphQo?.term_mret]);

  // item refreshment
  const [activeAuditAt, setActiveAuditAt] = useState(Date.now());

  function refreshRelation() {
    setActiveAuditAt(Date.now());
  }

  // function
  // parse tag
  const handleParseTag = async () => {
    if (!parseTagQo) {
      throw new Error('[news][audit] Stage parseTagQo is empty.');
    }
    if (!parseTagQo['tags']) {
      throw new Error('[news][audit] No tags to parse.');
    }
    try {
      const parseResultVoList = await parseTag(
        routing,
        parseTagQo['tags']);
      const termMretOpts = parseResultVoToTermMretOptBatch(parseResultVoList);
      setTermMretOpts(termMretOpts);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Failed to get term.\n', e.message);
      } else {
        console.error('Failed to get term.\n', e);
      }
    }
  }

  // term graph
  const [selectedTerm, setSelectedTerm] = useState<TermModel | null>(null);
  const [termGraph, setTermGraph] = useState<TermGraphModel | null>(null);
  const [searchTermGraphOk, setSearchTermGraphOk] = useState(true);
  // search term graph
  const searchTermGraph = async () => {
    // check params
    if (!searchTermGraphQo) {
      console.debug('[news][audit][term_graph][skip] State searchTermGraphQo is empty');
      return;
    }
    if (!searchTermGraphQo['name'] || !searchTermGraphQo['relation_type']) {
      console.debug('[news][audit][term_graph][skip] No search term graph qo specified:', searchTermGraphQo);
      return;
    }
    // init query status
    setSearchTermGraphOk(true);
    // query
    let graphVectorVo;
    try {
      graphVectorVo = await searchGraphVector(
        routing,
        searchTermGraphQo['name'],
        searchTermGraphQo['relation_type']) as GraphVo;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Graph searching failed. ' + error.message);
      } else {
        setError('Graph searching failed. Unknown reason.');
      }
      setSearchTermGraphOk(false);
      return;
    }
    if (!graphVectorVo) {
      noticing('No TermGraph Found.', {
        severity: 'warning',
        autoHideDuration: 3000,
      });
      return;
    }
    setSelectedTerm(buildTerm(searchTermGraphQo, graphVectorVo.nodes));
    setTermGraph(termGraphVoToModel(graphVectorVo));
    refreshRelation();
  }

  // check term graph complete
  function checkTermGraphComplete() {
    if (!termGraph) {
      return false;
    }
    return !checkEmpty(termGraph.nodes) && !checkEmpty(termGraph.edges);
  }

  // check term graph uncomplete
  function checkTermGraphUncomplete() {
    if (!termGraph) {
      return false;
    }
    return checkEmpty(termGraph.nodes) || checkEmpty(termGraph.edges);
  }

  // operation - detail an item
  const handleDetail = async (termId: number) => {
    try {
      const termVo = await getTerm(
        routing,
        termId);
      return termVoToModel(termVo);
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
  const [graphPathList, setGraphPathList] = useState<GraphPath[] | null>(null);

  function handleSetTravelPath(graphPath: GraphPath) {
    console.debug('[news][audit][path] Set travel path:', graphPath);
    if (!graphPathList) {
      setGraphPathList([graphPath]);
      return;
    }
    setGraphPathList((prevList) => {
      if (!prevList) {
        return [graphPath];
      }
      return [
        ...prevList,
        graphPath
      ]
    });
  }

  useEffect(() => {
    // check
    if (SetUtil_checkEmpty(attrSet) || SetUtil_checkEmpty(predSet) || ArrayUtil_checkEmpty(graphPathList)) {
      console.debug('[news][audit][vector][skip] No attribute or predicate set or no path iterations.');
      return;
    }
    console.debug('[news][audit][vector] param:', graphPathList);

    let attrPath: GraphPath | undefined;
    let predPath: GraphPath | undefined;
    for (const _path of graphPathList) {
      // check
      if (!attrSet.has(_path.label) && !predSet.has(_path.label)) {
        throw new Error('[news][audit][vector] Only attribute or predicate paths are allowed to clicked.');
      }
      // start travel
      if (!attrPath) {
        if (!attrSet.has(_path.label)) {
          throw new Error('[news][audit][vector] Click attribute path first, please.');
        }
        attrPath = _path;
        continue;
      }
      // intermediate travel
      if (attrSet.has(_path.label)) {
        if (!metaEqual(_path, attrPath)) {
          throw new Error('[news][audit][vector] Only meta-equally attribute paths are allowed to clicked.');
        }
        continue;
      }
      // end travel
      predPath = _path;
      setGraphPathList(null);
      break;
    }
    if (!attrPath || !predPath) {
      console.info('[news][audit][vector][skip] Invalid path to think.');
      return;
    }

    setThinking({
      ...thinking,
      attribute: attrPath.label,
      isAttrReverse: attrPath.isReverse,
      predicate: predPath.label,
      isPredReverse: predPath.isReverse,
    });
  }, [attrSet, predSet, graphPathList]);

  // build thinking
  const [thinking, setThinking] = useState<ThinkingModel | null>(null);

  // thinking result
  const [newsTitleMap, setNewsTitleMap] = useState<ThinkingResultNewsTitleMap | null>(null);


  // term relation
  const [termRelation, setTermRelation] = useState<TermRelationOpt | null>(null);

  // open/close term create drawer
  const [openTermCreateDrawer, setOpenTermCreateDrawer] = useState(false);
  // auto open term create drawer
  useEffect(() => {
    if ((searchTermGraphOk && !termRelation) || openTermCreateDrawer) {
      return;
    }
    setOpenTermCreateDrawer(true);
  }, [searchTermGraphOk, termRelation]);

  return (
    <>
      <TermCreateDrawer
        termName={searchTermGraphQo ? searchTermGraphQo['name'] : EMPTY_STRING}
        termRelation={termRelation ? termRelationOptToTermRelationModel(termRelation) : null}
        openSesame={openTermCreateDrawer}
        setOpenSesame={setOpenTermCreateDrawer}
        callbackRefresh={refreshRelation}
      />

      <StyledMuiAuthorityStepper>
        <ParsingTagSearchBar
          title={'Choose a tag as subject'}
          name={'tags'}
          formData={parseTagQo}
          setFormData={setParseTagQo}
          label={'Parse Tag'}
          onClick={handleParseTag}
          options={formData['tags']}
          isNextEnabled={!!termMretOpts}
        />

        <TermGraphSearchBar
          title={'Choose term-mret and predicate'}
          termMretFieldName={'term_mret'}
          termMretOptions={termMretOpts}
          relationTypeFieldName={'relation_type'}
          relationTypeOptions={formData["tags"]}
          formData={searchTermGraphQo}
          setFormData={setSearchTermGraphQo}
          label={'Search Graph'}
          onClick={searchTermGraph}
          isAutoSubmit={true}
          activeAt={activeTermGraphSearchAt}
          setActiveAt={setActiveTermGraphSearchAt}
          isNextEnabled={checkTermGraphComplete()}
        >
          {checkTermGraphUncomplete() && <TermAccessVector
              rawData={{
                relationType: searchTermGraphQo ? searchTermGraphQo['relation_type'] : EMPTY_STRING,
                isReverse: searchTermGraphQo ? searchTermGraphQo['is_reverse'] ?? false : false
              }}
              formData={termRelation}
              setFormData={setTermRelation}
          />}
        </TermGraphSearchBar>

        <TermGraph
          title={'Select speech vectors on graph'}
          item={selectedTerm}
          graph={termGraph}
          onDetailNode={handleDetail}
          onTravelPath={handleSetTravelPath}
          isNextEnabled={!!thinking?.attribute && !!thinking?.predicate}
          key={activeAuditAt}
        />

        <ThinkingCreate
          title={'Thinking'}
          label={'Search'}
          formData={thinking}
          setFormData={setThinking}
          speechVectorMap={speechVectorMap}
          onSetResultData={setNewsTitleMap}
          isNextEnabled={!!newsTitleMap && !!formData && newsTitleMap.has(formData.id)}
        />
      </StyledMuiAuthorityStepper>
    </>
  );
}

function buildTerm(searchTermGraphQo: SearchTermGraphQo, graphNodeVoList: GraphNodeVo[]): TermModel {
  // prepare inputs
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
    relation: [],
    tagList: [],
  };
}

export default NewsAudit;