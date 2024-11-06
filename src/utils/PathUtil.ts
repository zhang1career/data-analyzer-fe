/**
 * Parse the path into a directory and a basename
 * parse the right part of the last slash of the string
 * @param str
 * @param split
 */
export function ParsePath(str: string, split: string = '/'): [string | null, string] | null {
  // check param
  if (str === null) {
    return null;
  }
  if (!str) {
    return [null, ''];
  }
  // parse
  const lastSlashIndex = str.lastIndexOf(split);
  // return the original string if no slash is found
  if (lastSlashIndex === -1) {
    return [null, str];
  }
  if (lastSlashIndex <= 0) {
    return [split, str.substring(1)];
  }
  return [str.substring(0, lastSlashIndex + 1), str.substring(lastSlashIndex + 1)];
}