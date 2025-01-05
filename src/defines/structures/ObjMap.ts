import {StringableProps} from "@/defines/abilities/StringableProps.ts";

export class ObjMap<K extends StringableProps, V> {
  private map: { [key: string]: V } = {};

  constructor() {
  }

  set(key: K, value: V): void {
    this.map[key.toString()] = value;
  }

  get(key: K): V | undefined {
    return this.map[key.toString()];
  }

  has(key: K): boolean {
    return key.toString() in this.map;
  }

  delete(key: K): void {
    delete this.map[key.toString()];
  }

  get keys(): string[] {
    return Object.keys(this.map) as string[];
  }

  get values(): V[] {
    return Object.values(this.map);
  }

  get entries(): [string, V][] {
    return Object.entries(this.map) as [string, V][];
  }

  forEach(callback: (value: V, key: string) => void): void {
    for (const [key, value] of this.entries) {
      callback(value, key);
    }
  }
}