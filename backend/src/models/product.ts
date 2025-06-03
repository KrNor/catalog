import mongoose from "mongoose";
import { Product } from "../types";

const schema = new mongoose.Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    price: Number, // saved in cents
    avaliability: Number,
    Identifier: String,
    descriptionShort: String,
    descriptionLong: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
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
export default mongoose.model<Product>("Product", schema);
