export function Diff(map1: Map<string, any>,
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