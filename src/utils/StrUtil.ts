/**
 * Check if the string is empty
 * @param str
 */
export function checkEmpty(str: string | undefined | null): boolean {
  return str == null || !str || str.length <= 0;
}

/**
 * Convert the first character of the string to uppercase
 * @param str
 * @constructor
 */
export function UpperCaseHead(str: string): string {
  if (!str) {
    return str;
  }
  const firstChar = str[0].toUpperCase();
  return firstChar + str.substring(1);
}

/**
 * Split the string by the given symbol
 * @param str
 * @param symbol
 * @constructor
 */
export function Split(str: string, symbol: string): string[] {
  if (str === null) {
    return [];
  }
  if (!str) {
    return [''];
  }
  if (!symbol) {
    return [str];
  }
  return str.split(symbol);
}