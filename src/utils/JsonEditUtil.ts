import {JsonNode} from "@/defines/structures/Json.ts";

export function addNodeToTree(tree: JsonNode[],
                              path: number[],
                              newNode: JsonNode): JsonNode[] {
  if (path.length === 0) {
    return [...tree, newNode];
  }
  const index = path[0];
  return tree.map((node, i) =>
    i === index ? {
      ...node,
      value: Array.isArray(node.value)
        ? addNodeToTree(node.value as JsonNode[], path.slice(1), newNode)
        : [newNode],
    } : node
  );
}

export function updateNodeInTree(tree: JsonNode[],
                                 path: number[],
                                 key: string,
                                 value: boolean | number | string | JsonNode[]): JsonNode[] {
  if (path.length === 0) {
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
      value: path.length > 1
        ? updateNodeInTree(node.value as JsonNode[], path.slice(1), key, value)
        : value,
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