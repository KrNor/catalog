import store from "./store";

export interface Product extends SimplifiedProduct {
  Identifier: string;
  descriptionLong: string;
  tags: [TagToSave];
}
export interface SimplifiedProduct {
  name: string;
  price: number; // saved in cents
  avaliability: number;
  descriptionShort: string;
  category: string;
  id: string;
}

export interface TagToSave {
  tagName: string;
  tagAttribute: string;
}
