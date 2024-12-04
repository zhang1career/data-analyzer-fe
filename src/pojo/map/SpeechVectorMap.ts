import {Stringable} from "@/components/helpers/ObjMap.ts";
import {SpeechVector} from "@/models/SpeechVector.ts";

export class SpeechVectorKey implements SpeechVector, Stringable {
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
    return `SpeechVectorKey(${this.attribute}, ${this.isAttrReverse}, ${this.predicate}, ${this.isPredReverse})`;
  }
}