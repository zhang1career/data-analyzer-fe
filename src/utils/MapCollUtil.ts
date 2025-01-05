export function addToSet<K, V>(givenMap: Map<K, Set<V>>, key: K, value: V): void {
  if (!givenMap.has(key)) {
    givenMap.set(key, new Set<V>([value]));
    return;
  }

  const processingSet = givenMap.get(key);
  if (!processingSet) {
    throw new Error('[util][map_coll] processing set is null');
  }
  processingSet.add(value);
}