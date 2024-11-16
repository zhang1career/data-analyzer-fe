import {cookies} from 'next/headers';

export function getCookie(name: string): string | undefined | null {
  const allCookies = cookies();
  const myCookie = allCookies.get(name);

  if (!myCookie) {
    console.warn(`[cookie][skip] ${name} not found`);
    return null;
  }

  // Parse the cookie string to get the expiration date
  const cookieParts = myCookie.value.split('; ');
  const valuePart = cookieParts.find((part) => part.startsWith('v='));
  const expiresPart = cookieParts.find((part) => part.startsWith('e='));
  // no expire
  if (!expiresPart) {
    console.debug(`[cookie][skip] ${name} has no expiration date`);
    return valuePart?.split('=')[1];
  }
  // check if the cookie has expired
  const expiresDate = new Date(expiresPart.split('=')[1]);
  const now = new Date();
  if (expiresDate < now) {
    console.warn(`[cookie][skip] ${name} has expired`);
    return undefined;
  }
  return valuePart?.split('=')[1];
}

export function setCookie(name: string, value: string, expires?: Date): void {
  const allCookies = cookies();
  allCookies.set(name, `v=${value}${expires ? `; e=${expires.toUTCString()}` : ''}`);
}