import {SpeechVector} from "@/models/SpeechVector.ts";
import {StringableProps} from "@/defines/abilities/StringableProps.ts";

export class SpeechVectorKey implements SpeechVector, StringableProps {
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