import {EMPTY_MAP} from "@/consts/MapConst.ts";

export function checkEmpty(map: Map<string, any>): boolean {
  return map != null && Object.keys(map).length > 0;
}

/**
 * Deep clone an object to a new map.
 * The clone is recursive when the value is an object.
 * @param obj
 */
export function deepCopyFrom(obj: any): Map<string, any> {
  if (obj == null || !obj) {
    return EMPTY_MAP;
  }

  // simple value
  if (typeof obj !== 'object') {
    return structuredClone(obj);
  }

  const target = new Map<string, any>();
  for (const key in obj) {
    const value = obj[key];
    // simple value
    if (value === null || typeof value !== 'object') {
      target.set(key, structuredClone(value));
      continue;
    }
    // array
    if (Array.isArray(value)) {
      const copiedArray = [];
      for (const item of value) {
        copiedArray.push(deepCopyFrom(item));
      }
      target.set(key, copiedArray);
      continue;
    }
    // nested object
    target.set(key, deepCopyFrom(value));
  }

  return target;
}

// Usage
const sourceObj = {
  key1: 'value1',
  key2: {
    key3: 'value3',
    key4: {
      key5: 'value5'
    }
  }
};

export function diff(map1: Map<string, any>,
                     map2: Map<string, any>): Map<string, any> {
  // if map1 is null or empty, return an empty map
  if (!map1 || map1.size === 0) {
    console.log('map1 is null');
    return new Map<string, any>();
  }
  // if map2 is null or empty, return map1
  if (!map2 || map2.size === 0) {
    console.log('map2 is null');
    return new Map(map1);
  }

  const diffMap = new Map<string, any>();
  for (const [key, value] of map1) {
    if (!map2.has(key)) {
      diffMap.set(key, value);
    }
  }

  return diffMap;
}


export function PutObject<K, V>(map: Map<string, V>, key: K, value: V) {
  const keyStr = JSON.stringify(key)
  map.set(keyStr, value);
}

export function GetObject<K, V>(map: Map<string, V>, key: K): V | undefined {
  const keyStr = JSON.stringify(key)
  return map.get(keyStr);
}