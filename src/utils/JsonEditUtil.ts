import {JsonNode, JsonValue} from "@/defines/structures/Json.ts";

export function addNodeToTree(tree: JsonNode[],
                              path: number[],
                              newNode: JsonNode | JsonNode[]): JsonNode[] {
  if (path.length === 0) {
    if (Array.isArray(newNode)) {
      return [...tree, ...newNode];
    }
    return [...tree, newNode];
  }
  const index = path[0];
  return tree.map((node, i) =>
    i === index ? {
      ...node,
      value: Array.isArray(node.value)
        ? addNodeToTree(node.value as JsonNode[], path.slice(1), newNode)
        : Array.isArray(newNode) ? newNode : [newNode],
    } : node
  );
}

export function updateNodeInTree(tree: JsonNode[],
                                 path: number[],
                                 key: string,
                                 value: JsonValue): JsonNode[] {
  if (path.length < 1) {
    return tree;
  }
  if (path.length === 1) {
    const index = path[0];
    return tree.map((node, i) =>
      i === index ? {
        ...node,
        key,
        value,
      } : node
    );
  }
  const index = path[0];
  return tree.map((node, i) =>
    i === index ? {
      ...node,
      value: updateNodeInTree(node.value as JsonNode[], path.slice(1), key, value)
    } : node
  );
}

export function removeNodeFromTree(tree: JsonNode[],
                                   path: number[]): JsonNode[] {
  if (path.length === 1) {
    return tree.filter((_, i) => i !== path[0]);
  }
  const index = path[0];
  return tree.map((node, i) =>
    i === index ? {
      ...node,
      value: Array.isArray(node.value)
        ? removeNodeFromTree(node.value as JsonNode[], path.slice(1))
        : node.value,
    } : node
  );
}

export function updateNodeInTreeBatch(tree: JsonNode[],
                                      path: number[],
                                      valueObj: { [key: string]: JsonValue }): JsonNode[] {
  if (path.length < 1) {
    return tree;
  }
  if (path.length === 1) {
    const index = path[0];
    return tree.map((_node, i) =>
      i === index ? {
        ..._node,
        value: Object.entries(valueObj).map(([key, value]) => {return {key, value} as JsonNode})
      } : _node
    );
  }
  const index = path[0];
  return tree.map((_node, _i) =>
    _i === index ? {
      ..._node,
      value: updateNodeInTreeBatch(_node.value as JsonNode[], path.slice(1), valueObj)
    } : _node
  );
}

export function removeNodeFromTreeBatch(tree: JsonNode[],
                                        path: number[],
                                        keySet: Set<string>): JsonNode[] {
  if (path.length === 1) {
    return tree.filter((_node, _i) => _i < path[0] || !keySet.has(_node.key));
  }
  const index = path[0];
  return tree.map((_node, _i) =>
    _i === index ? {
      ..._node,
      value: Array.isArray(_node.value)
        ? removeNodeFromTreeBatch(_node.value as JsonNode[], path.slice(1), keySet)
        : _node.value,
    } : _node
  );
}