export function checkObject(obj: any): boolean {
    return obj !== null && typeof obj === 'object';
}

/**
 * Check if the object is empty
 * @param obj
 * @returns boolean
 */
export function checkEmpty(obj: { [key: string]: any } | undefined | null): obj is null | undefined | {} {
  return obj == null || !obj || Object.keys(obj).length <= 0;
}

/**
 * Get the value from the object safely
 * @param obj
 * @param key
 * @param defaultValue
 */
export function getValueSafely(obj: {[key: string]: any} | undefined | null, key: string, defaultValue = ''): any {
  if (!obj || !key) {
    return defaultValue;
  }

  return obj[key] !== undefined && obj[key] !== null ? obj[key] : defaultValue;
}

/**
 * Create a new object
 */
export function newObj<T>(): T {
  return {} as T;
}

/**
 * Create a new object, with the type of { [key: string]: any }
 */
export function newDict(): { [key: string]: any } {
  return newObj();
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}