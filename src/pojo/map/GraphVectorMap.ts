import {Stringable} from "@/components/helpers/ObjMap.ts";

export type GraphVectorMap = Map<GraphVectorType, string>;

export interface GraphVectorType {
  attribute: string;
  isAttrReverse: boolean;
  predicate: string;
  isPredReverse: boolean;
}

export class GraphVectorKey implements GraphVectorType, Stringable {
  attribute: string;
  isAttrReverse: boolean;
  predicate: string;
  isPredReverse: boolean;

  constructor(attribute: string,
              isAttrReverse: boolean,
              predicate: string,
              isPredReverse: boolean) {
    this.attribute = attribute;
    this.isAttrReverse = isAttrReverse;
    this.predicate = predicate;
    this.isPredReverse = isPredReverse;
  }

  toString() {
    return `GraphVectorKey(${this.attribute}, ${this.isAttrReverse}, ${this.predicate}, ${this.isPredReverse})`;
  }
}