export interface TagAttributeFromDb {
  tagAttribute: string;
  count: number;
}

export interface TagWithCountFromDb {
  count: number;
  tagName: string;
  attributes: TagAttributeFromDb[];
}

export interface TagToSave {
  tagName: string;
  tagAttribute: string;
}
