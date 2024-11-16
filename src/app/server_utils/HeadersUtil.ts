import {headers} from 'next/headers';
import {EMPTY_STRING} from "@/consts/StrConst.ts";

export function getValue(key: string): string {
  const value = headers().get(key);
  if (!value) {
    return EMPTY_STRING;
  }
  return value;
}