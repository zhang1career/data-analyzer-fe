/**
 * Get the current date and time
 */
export function getNow(): Date {
  return new Date();
}

/**
 * Get the current date and time in the format "YYYY-MM-DD HH:mm:ss"
 * @param date
 */
export function getDateTimeString(date: Date): string {
  return date.toISOString().replace("T", " ").substring(0, 19);
}