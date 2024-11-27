'use client';

import React from 'react';
import CytoscapeComponent from "react-cytoscapejs";
import cola from 'cytoscape-cola';
import cytoscape, {ElementDefinition, LayoutOptions, SingularElementArgument} from "cytoscape";
import {Md5} from "ts-md5";
import {diff} from "@/utils/MapUtil.ts";
import {TermVo} from "@/pojo/vos/TermVo.ts";
import {TermGraph} from "@/models/Term.ts";
import {WHEEL} from "@/lookings/color.ts";


cytoscape.use(cola);

export interface RelationGrowthProps {
  originTerm: string;
  addingTerm: string;
  relation: string;
  isReverse: boolean;
}

type Node = ElementDefinition & { group: 'nodes' };
type Edge = ElementDefinition & { group: 'edges' };


interface TermRelationProps {
  item?: TermVo;
  graph?: TermGraph;
  onDetail: (termId: number) => Promise<TermVo | null>;
  onGrowRelation?: (relationList: RelationGrowthProps[]) => void;
}

const TermRelation: React.FC<TermRelationProps> = ({
                                                     item = undefined,
                                                     graph = undefined,
                                                     onDetail,
                                                     onGrowRelation = undefined,
                                                   }) => {
  let initElementMap = new Map<string, ElementDefinition>();
  if (item) {
    initElementMap = buildElementMapFromNode(item);
  }
  if (graph) {
    initElementMap = buildElementMapFromGraph(graph);
  }

  const cyHandler = (cy: cytoscape.Core) => {
    // Listen for tap events on nodes
    cy.on('tap', 'node', (event) => {
      const node = event.target;
      console.log('Node tapped:', node);
      const focusTerm = onDetail(parseInt(node.data().id));

      focusTerm.then((_term) => {
        if (_term === null) {
          console.error('Term not found:', node.data().id);
          return;
        }
        const newElementMap = buildElementMapFromNode(_term);
        if (newElementMap.size > 0) {
          addRelation(cy, newElementMap, onGrowRelation);
        }
      })
    });

    // Listen for tap events on edges
    cy.on('tap', 'edge', (event) => {
      const edge = event.target;
      console.log('Edge tapped:', edge.data());
    });

    // Listen for tap events on the background (core)
    cy.on('tap', (event) => {
      if (event.target === cy) {
        console.log('Background tapped');
      }
    });
  }

  const elementRef = React.useRef<HTMLDivElement>(null);

  return (
    <div style={{width: '800px', height: '400px'}} ref={elementRef}>
      <CytoscapeComponent
        elements={Array.from(initElementMap.values())}
        style={style}
        layout={layout}
        stylesheet={stylesheet}
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
      addRelatingTerm(nodeList, edgeList, _srcTerm, _srcTerm, term, _srcTerm.relate_type);
    });
  }
  // add dest nodes and edges
  const destTermMap = term.dest_term;
  if (Object.keys(destTermMap).length !== 0) {
    Object.values(destTermMap).forEach(_destTerm => {
      addRelatingTerm(nodeList, edgeList, _destTerm, term, _destTerm, _destTerm.relate_type);
    });
  }

  return buildElementMap(nodeList, edgeList);
}

function buildElementMapFromGraph(graph: TermGraph): Map<string, ElementDefinition> {
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
                         srcTerm: TermVo, destTerm: TermVo, relateType: string) {
  addNode(nodeList, addTerm.id.toString(), addTerm.name);

  const srcId = srcTerm.id.toString();
  const destId = destTerm.id.toString();
  const edgeId = buildEdgeId(srcId, destId, relateType);
  addEdge(edgeList, edgeId, srcId, destId, relateType);
}

function addNode(nodeList: ElementDefinition[], nodeId: string, nodeLabel: string) {
  nodeList.push(createNode(nodeId, nodeLabel));
}

function addEdge(edgeList: ElementDefinition[],
                 edgeId: string, edgeSrcId: string, edgeDestId: string, edgeLabel: string) {
  edgeList.push(
    createEdge({
      edgeId: edgeId,
      label: edgeLabel,
      srcId: edgeSrcId,
      destId: edgeDestId
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

function buildEdgeId(srcId: string, destId: string, relation: string): string {
  return Md5.hashStr(srcId + '-' + destId + '-' + relation).substring(0, 8);
}

function addRelation(cy: cytoscape.Core,
                     toAddElementMap: Map<string, ElementDefinition>,
                     onAppendTrace: ((traceList: RelationGrowthProps[]) => void) | undefined) {
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

  // calc trace
  if (onAppendTrace !== undefined) {
    const appendingTraceList = calcTrace(originElementMap, addingElementMap);
    if (appendingTraceList.length > 0) {
      onAppendTrace(appendingTraceList);
    }
  }

  console.debug('Node and edges added:', addingElementMap.values());
}

function calcTrace(originElementMap: Map<string, cytoscape.ElementDefinition>,
                   addingElementMap: Map<string, cytoscape.ElementDefinition>): RelationGrowthProps[] {
  const traceList: RelationGrowthProps[] = [];

  for (const addingElement of addingElementMap.values()) {
    // skip nodes
    if (addingElement.group === 'nodes') {
      continue;
    }
    // originNode -addingElement-> addingNode
    if (originElementMap.has(addingElement.data.source)
      && addingElementMap.has(addingElement.data.target)) {
      const srcNode = originElementMap.get(addingElement.data.source);
      const destNode = addingElementMap.get(addingElement.data.target);
      if (srcNode === undefined || destNode === undefined) {
        console.warn('Invalid edge:', addingElement);
        continue;
      }
      traceList.push({
        originTerm: srcNode.data.label,
        addingTerm: destNode.data.label,
        relation: addingElement.data.label,
        isReverse: false
      });
      continue;
    }
    // addingNode -addingElement-> originNode
    if (originElementMap.has(addingElement.data.target)
      && addingElementMap.has(addingElement.data.source)) {
      const srcNode = addingElementMap.get(addingElement.data.source);
      const destNode = originElementMap.get(addingElement.data.target);
      if (srcNode === undefined || destNode === undefined) {
        console.warn('Invalid edge:', addingElement);
        continue;
      }
      traceList.push({
        originTerm: destNode.data.label,
        addingTerm: srcNode.data.label,
        relation: addingElement.data.label,
        isReverse: true
      });
      continue;
    }
    console.warn('Ring detected:', addingElement);
  }

  return traceList;
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
  'width': 3,
  'line-color': 'gray',
  'target-arrow-shape': 'triangle',
  'target-arrow-color': 'gray',
  'curve-style': 'bezier',
  'label': 'data(label)',
  'font-size': 6,
};

const stylesheet = [
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

export default TermRelation;