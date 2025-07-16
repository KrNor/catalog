import mongoose, { Types, Document, Schema } from "mongoose";
import { TagInsideProduct } from "../types";
import { refreshProductCount } from "../middleware/dbMiddleware";
// import { MongooseImage } from "./image";

interface MongooseImage {
  url: string;
  publicId: string;
}

const ImageSchema: Schema<MongooseImage> = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

export interface MongooseProduct {
  name: string;
  price: number; // saved in cents
  availability: number;
  identifier: string;
  descriptionShort: string;
  descriptionLong: string;
  category: Types.ObjectId;
  tags: TagInsideProduct[];
  mainImage: MongooseImage;
  imageGallery: MongooseImage[];
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
    availability: { type: Number, required: true, min: -4, trim: true },
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
        _id: false,
      },
    ],
    mainImage: { type: ImageSchema }, //{ type: ImageSchema, required: true }, not required for now, probably implement a default image differently than now
    imageGallery: [ImageSchema],
  },
  { timestamps: true }
);

schema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

schema.post("save", async function (_doc, next) {
  // console.log("post save pop");
  await refreshProductCount();
  next();
});

schema.post("findOneAndUpdate", async function (_doc, next) {
  // console.log("post findOneAndUpdate pop");
  await refreshProductCount();
  next();
});

schema.post("findOneAndDelete", async function (_doc, next) {
  // console.log("post deleteOne pop");
  await refreshProductCount();
  next();
});

const Product = mongoose.model<ProductDocument>("Product", schema);

export default Product;
