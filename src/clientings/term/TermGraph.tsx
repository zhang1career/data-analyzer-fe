'use client';

import React, {useEffect, useState} from 'react';
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, {ElementDefinition, LayoutOptions, SingularElementArgument} from "cytoscape";
import cola from 'cytoscape-cola';
// import panzoom from 'cytoscape-panzoom';
import makeStyles from '@mui/styles/makeStyles';
import {diff} from "@/utils/MapUtil.ts";
import {TermVo} from "@/pojo/vo/TermVo.ts";
import {TermGraphModel, TermModel} from "@/models/TermModel.ts";
import {termGraphEdgeVoToModel} from "@/mappers/TermGraphMapper.ts";
import {voToModel} from "@/mappers/TermMapper.ts";
import {GraphPath} from "@/models/GraphPath.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";
import {checkEmpty} from "@/utils/StrUtil.ts";
import {useDelayEffect} from "@/utils/DelayUtil.ts";
import {WHEEL} from "@/lookings/color.ts";
import {TitledProps} from "@/defines/abilities/TitledProps.ts";
import {DescribableProps} from "@/defines/abilities/DescribableProps.ts";
import {SteppableProps} from "@/defines/abilities/SteppableProps.ts";


// cytoscape
// plugin
cytoscape.use(cola);
// cytoscape.use(panzoom);

// input
type Node = ElementDefinition & { group: 'nodes' };
type Edge = ElementDefinition & { group: 'edges' };

// style
const warningLightStyles = makeStyles({
  flashBorder: {
    border: '1px solid red',
    transition: '0.2s border-color ease-in-out',
  },
  regularBorder: {
    transition: '0.2s border-color ease-in-out',
  },
});

interface TermGraphProps extends TitledProps, DescribableProps, SteppableProps {
  item: TermVo | null;
  graph?: TermGraphModel | null;
  onDetailNode: (termId: number) => Promise<TermVo | null>;
  onTravelPath?: (graphPathList: GraphPath) => void;
}

const TermGraph: React.FC<TermGraphProps> = ({
                                               item,
                                               graph,
                                               onDetailNode,
                                               onTravelPath = undefined,
                                             }: TermGraphProps) => {
  // input state
  // start term
  const [startTerm, setStartTerm] = useState<TermModel | null>(null);
  // traveled node
  const [traveledNodeSet, setTraveledNodeSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (item === null) {
      setStartTerm(null);
      setTraveledNodeSet(new Set());
      return;
    }
    setStartTerm(voToModel(item));
    setTraveledNodeSet(new Set([String(item.id)]));
  }, [item]);

  // if graph is given, use graph; otherwise, use item
  let initElementMap = new Map<string, ElementDefinition>();
  if (graph) {
    initElementMap = buildElementMapFromGraph(graph);
  } else if (item) {
    initElementMap = buildElementMapFromNode(item);
  }

  const cyHandler = (cy: cytoscape.Core) => {
    // Add the panzoom control
    // cy.panzoom({
    //   fit: true, // Fit the graph to the container on initialization
    //   zoomFactor: 0.1, // Zoom factor per zoom step
    //   minZoom: 0.1, // Minimum zoom level
    //   maxZoom: 10, // Maximum zoom level
    // });

    // Listen for tap events on nodes
    cy.on('tap', 'node', (event) => {
      const node = event.target;
      console.debug('Node tapped:', node);
      const focusTerm = onDetailNode(parseInt(node.data().id));

      focusTerm.then((_term) => {
        if (_term === null) {
          console.error('Term not found:', node.data().id);
          return;
        }
        const newElementMap = buildElementMapFromNode(_term);
        if (newElementMap.size > 0) {
          addRelation(cy, newElementMap);
        }
      })
    });

    // Listen for tap events on edges
    cy.on('tap', 'edge', (event) => {
      if (!onTravelPath) {
        console.warn('Edge travel is not available.');
        return;
      }
      // get param
      const edge = event.target;
      console.debug('Edge tapped:', edge.data());
      // travel
      travel(edge.data(), onTravelPath);
    });

    // Listen for tap events on the background (core)
    cy.on('tap', (event) => {
      if (event.target === cy) {
        console.log('Background tapped');
      }
    });
  }

  const travel = (data: any,
                  onTravelGraph: ((graphPathList: GraphPath) => void) | undefined) => {
    const srcId = data.source;
    const destId = data.target;
    // check param
    if (srcId === undefined || destId === undefined) {
      throw new Error('Edge source or target is undefined.');
    }
    if (!traveledNodeSet.has(srcId) && !traveledNodeSet.has(destId)) {
      console.log('[term][graph][skip] The edge tapped is invalid to travel.')
      setError(true);
      return;
    }
    if (traveledNodeSet.has(srcId) && traveledNodeSet.has(destId)) {
      console.log('[term][graph][skip] Circling edge is invalid to travel.')
      setError(true);
      return;
    }
    // travel
    let _path: GraphPath;
    if (traveledNodeSet.has(srcId)) { // forward
      _path = {
        id: data.id,
        startId: srcId,
        stopId: destId,
        label: data.label,
        isReverse: false
      }
    } else { // backward
      _path = {
        id: data.id,
        startId: destId,
        stopId: srcId,
        label: data.label,
        isReverse: true
      }
    }
    setTraveledNodeSet((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.add(_path.stopId);
      return newSet;
    });
    if (onTravelGraph) {
      onTravelGraph(_path);
    }
  }

  // style
  const classes = warningLightStyles();

  const [error, setError] = useState(false);

  useDelayEffect(() => {
    setError(false);
  }, [error]);

  // element
  const elementRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      className={error ? classes.flashBorder : classes.regularBorder}
      style={{width: '800px', height: '400px'}}
      ref={elementRef}
    >
      <CytoscapeComponent
        elements={Array.from(initElementMap.values())}
        style={style}
        layout={layout}
        stylesheet={startTerm ? buildStyleSheet(startTerm.name) : buildStyleSheet(EMPTY_STRING)}
        maxZoom={1e50}
        cy={cyHandler}
      />
    </div>
  );
};

function buildElementMapFromNode(term: TermVo): Map<string, ElementDefinition> {
  const nodeList: ElementDefinition[] = []
  const edgeList: ElementDefinition[] = []
  // addNode with origin node
  addTerm(nodeList, term)
  // add src nodes and edges
  const srcTermMap = term.src_term;
  if (Object.keys(srcTermMap).length !== 0) {
    Object.values(srcTermMap).forEach(_srcTerm => {
      addRelatingTerm(nodeList, edgeList, _srcTerm, _srcTerm, term);
    });
  }
  // add dest nodes and edges
  const destTermMap = term.dest_term;
  if (Object.keys(destTermMap).length !== 0) {
    Object.values(destTermMap).forEach(_destTerm => {
      addRelatingTerm(nodeList, edgeList, _destTerm, term, _destTerm);
    });
  }

  return buildElementMap(nodeList, edgeList);
}

function buildElementMapFromGraph(graph: TermGraphModel): Map<string, ElementDefinition> {
  const nodeList: ElementDefinition[] = []
  const edgeList: ElementDefinition[] = []

  graph.nodes.forEach(node => {
    nodeList.push(createNode(String(node.id), node.label));
  });
  graph.edges.forEach(edge => {
      const _edge = createEdge({
        edgeId: String(edge.id),
        label: String(edge.label),
        srcId: String(edge.src_id),
        destId: String(edge.dest_id),
        eSpeech: edge.speech_type,    // edge speech type
      });
      edgeList.push(_edge);
    }
  );
  return buildElementMap(nodeList, edgeList);
}

function buildElementMap(nodeList: cytoscape.ElementDefinition[], edgeList: cytoscape.ElementDefinition[]) {
  const elementMap = new Map<string, ElementDefinition>();
  nodeList.forEach(element => {
    if (element.data.id === undefined) {
      console.error('node id is undefined:', element);
      return;
    }
    elementMap.set(element.data.id.toString(), element);
  });
  edgeList.forEach(element => {
    if (element.data.id === undefined) {
      throw new Error('edge id is undefined');
    }
    elementMap.set(element.data.id, element);
  });

  return elementMap;
}

function addTerm(nodeList: ElementDefinition[], addTerm: TermVo) {
  addNode(nodeList, addTerm.id.toString(), addTerm.name);
}

function addRelatingTerm(nodeList: ElementDefinition[],
                         edgeList: ElementDefinition[],
                         addTerm: TermVo,
                         srcTerm: TermVo,
                         destTerm: TermVo) {
  addNode(nodeList, addTerm.id.toString(), addTerm.name);

  Object.entries(addTerm.r).forEach(([key, value]) => {
    const _model = termGraphEdgeVoToModel(value);
    const edgeId = key;
    const srcId = srcTerm.id.toString();
    const destId = destTerm.id.toString();
    addEdge(edgeList, edgeId, srcId, destId, _model.label, _model.speech_type);
  });
}

function addNode(nodeList: ElementDefinition[], nodeId: string, nodeLabel: string) {
  nodeList.push(createNode(nodeId, nodeLabel));
}

function addEdge(edgeList: ElementDefinition[],
                 edgeId: string, edgeSrcId: string, edgeDestId: string, edgeLabel: string, edgeSpeech: number) {
  edgeList.push(
    createEdge({
      edgeId: edgeId,
      label: edgeLabel,
      srcId: edgeSrcId,
      destId: edgeDestId,
      eSpeech: edgeSpeech
    })
  );
}

function createNode(nodeId: string, nodeLabel: string) {
  const node: Node = {data: {id: nodeId, label: nodeLabel}, group: 'nodes'};
  return node;
}

/**
 * Create an edge between two nodes.
 * @param edgeId
 * @param label
 * @param srcId
 * @param destId
 * @param isReverse is reverse edge
 * @param eSpeech edge speech type
 */
interface EdgeProps {
  // cytoscape properties
  edgeId: string;
  label: string;
  srcId: string;
  destId: string;
  // user defined properties
  isReverse?: boolean;
  eSpeech?: number;
}

function createEdge({
                      edgeId,
                      label,
                      srcId,
                      destId,
                      ...rest
                    }: EdgeProps): Edge {
  return {
    group: 'edges',
    data: {id: edgeId, source: srcId, target: destId, label: label, ...rest}
  };
}

function addElementMap(map: Map<string, ElementDefinition>, element: SingularElementArgument) {
  if (element.isNode()) {
    map.set(
      element.data().id,
      createNode(element.data().id, element.data().label)
    );
  } else {
    map.set(
      element.data().id,
      createEdge({
        edgeId: element.data().id,
        label: element.data().label,
        srcId: element.data().source,
        destId: element.data().target
      })
    );
  }
}

function addRelation(cy: cytoscape.Core,
                     toAddElementMap: Map<string, ElementDefinition>) {
  if (toAddElementMap.size === 0) {
    console.debug("Node and edges unchanged, no to-add given.");
    return
  }
  console.debug('Node and edges to add:', toAddElementMap.values());

  // prepare to update
  const originElementMap: Map<string, ElementDefinition> = new Map();
  const originElementList = cy.elements();
  if (originElementList.size() >= 0) {
    for (const originElement of originElementList) {
      addElementMap(originElementMap, originElement);
    }
  }

  const addingElementMap = diff(toAddElementMap, originElementMap);
  if (addingElementMap.size === 0) {
    console.debug("Node and edges unchanged, nothing adding.");
    return
  }
  console.debug("Node and edges adding...");

  // lock before update
  cy.nodes().forEach(node => {
    node.lock();
  });

  cy.add(Array.from(addingElementMap.values()));

  // unlock
  const layout = cy.makeLayout(layoutOptions);
  layout.run();
  layout.on('layoutstop', () => {
    cy.nodes().forEach(node => {
      node.unlock();
    })
  })

  console.debug('Node and edges added:', addingElementMap.values());
}

const style = {
  width: '100%',
  height: '100%',
  border: '1px solid #ccc',
};

const DEFAULT_NODE_STYLE = {
  'width': 15,
  'height': 15,
  'background-color': WHEEL['main_green'],
  'background-fit': 'cover',
  'border-color': 'black',
  'border-width': 1,
  'border-opacity': 0.1,
  'label': 'data(label)',
  'font-size': 6,
};

const DEFAULT_EDGE_STYLE = {
  'width': 1,
  'line-color': 'gray',
  'target-arrow-shape': 'triangle',
  'target-arrow-color': 'gray',
  'curve-style': 'bezier',
  'label': 'data(label)',
  'font-size': 5,
};

function buildStyleSheet(startNodeLabel: string) {
  const retList = [
    {
      selector: 'node',
      style: DEFAULT_NODE_STYLE
    },
    {
      selector: 'edge',
      style: DEFAULT_EDGE_STYLE
    },
    {
      selector: '[eSpeech = 0]',
      style: {
        ...DEFAULT_EDGE_STYLE,
        'line-color': WHEEL['light_green'],
        'target-arrow-color': WHEEL['light_green'],
      }
    },
    {
      selector: '[eSpeech = 1]',
      style: {
        ...DEFAULT_EDGE_STYLE,
        'line-color': WHEEL['dark_blue'],
        'target-arrow-color': WHEEL['dark_blue'],
      }
    }
  ];

  if (!checkEmpty(startNodeLabel)) {
    const _startNode = 'node[label = "' + startNodeLabel + '"]';
    retList.push(
      {
        selector: _startNode,
        style: {
          ...DEFAULT_NODE_STYLE,
          'background-color': 'red',
        }
      }
    );
  }

  return retList;
}

const layout = {
  name: 'cola',
  directed: true
};

const layoutOptions: LayoutOptions = {
  name: 'cola',
  handleDisconnected: true,
  animate: true,
  avoidOverlap: true,
  infinite: false,
  unconstrIter: 1,
  userConstIter: 0,
  allConstIter: 1,
  ready: (event) => {
    event.cy.fit()
    event.cy.center()
  }
}

export default TermGraph;