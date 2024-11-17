/**
 * Check if the object is empty
 * @param obj
 * @returns boolean
 */
export function checkEmpty(obj: { [key: string]: any } | undefined | null): boolean {
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