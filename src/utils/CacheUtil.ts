import ls from "localstorage-slim";

export function getCachedData<T>(key: string, onDefault: () => T, options = {ttl: 5 * 60}): T {
  const cachedData = ls.get(key) as T;
  if (cachedData) {
    return cachedData;
  }

  const defaultData = onDefault();
  ls.set(key, defaultData, options);
  return defaultData;
}

export function setCachedData<T>(key: string, data: T, options = {ttl: 5 * 60}): void {
  ls.set(key, data, options);
}