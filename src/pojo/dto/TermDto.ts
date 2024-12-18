export class TermDto {
  id: number;
  name: string;
  content: string;
  relation: TermRelationDto[];

  constructor(id: number,
              name: string,
              content: string,
              relation: TermRelationDto[]) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.relation = relation;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      content: this.content,
      relation: this.relation.map(_relation => _relation.toJSON()),
    };
  }
}

export class TermRelationDto {
  name: string;
  relation_type: string;
  is_reverse: boolean;

  constructor(name: string,
              relation_type: string,
              is_reverse: boolean) {
    this.name = name;
    this.relation_type = relation_type;
    this.is_reverse = is_reverse;
  }

  toJSON() {
    return {
      name: this.name,
      relation_type: this.relation_type,
      is_reverse: this.is_reverse,
    };
  }
}