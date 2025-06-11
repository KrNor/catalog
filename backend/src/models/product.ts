import mongoose, { Types, Document } from "mongoose";
import { TagInsideProduct } from "../types";

export interface MongooseProduct {
  name: string;
  price: number; // saved in cents
  avaliability: number;
  identifier: string;
  descriptionShort: string;
  descriptionLong: string;
  category: Types.ObjectId;
  tags: TagInsideProduct[];
}

export interface ProductDocument extends MongooseProduct, Document {}

const schema = new mongoose.Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      minLength: 3,
    },
    price: { type: Number, required: true, trim: true }, // saved in cents
    avaliability: { type: Number, required: true, min: -4, trim: true },
    identifier: { type: String, required: true, trim: true },
    descriptionShort: {
      type: String,
      required: true,
      minLength: 3,
      trim: true,
    },
    descriptionLong: { type: String, required: true, minLength: 3, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    tags: [
      {
        tagName: String,
        tagAttribute: String,
      },
    ],
  },
  { timestamps: true }
);

schema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Product = mongoose.model<ProductDocument>("Product", schema);

export default Product;
