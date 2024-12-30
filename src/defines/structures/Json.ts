export interface JsonNode {
  key: string;
  value: boolean | number | string | JsonNode[];
}

export function jsonNodeeToObject(tree: JsonNode[]): any {
  return tree.reduce((acc, node) => {
    acc[node.key] = Array.isArray(node.value) ? jsonNodeeToObject(node.value) : node.value;
    return acc;
  }, {} as any);
}

export function emptyJsonNode(): JsonNode {
  return {
    key: '',
    value: '',
  };
}