export type PrimitiveJsonValue = boolean | number | string | JsonNode[];

export type JsonValue = PrimitiveJsonValue | PrimitiveJsonValue[];

export interface JsonNode {
  key: string;
  value: JsonValue;
}

export function jsonNodeToObject(tree: JsonValue): any {
  if (typeof tree === 'boolean' || typeof tree === 'number' || typeof tree === 'string') {
    return tree;
  }
  return tree.reduce((acc, node) => {
    if (typeof node === 'boolean' || typeof node === 'number' || typeof node === 'string') {
      return [...acc, node];
    }
    if (Array.isArray(node)) {
      return [...acc, jsonNodeToObject(node)];
    }
    acc[node.key] = Array.isArray(node.value) ? jsonNodeToObject(node.value) : node.value;
    return acc;
  }, {} as any);
}

export function emptyJsonNode(): JsonNode {
  return {
    key: '',
    value: '',
  };
}