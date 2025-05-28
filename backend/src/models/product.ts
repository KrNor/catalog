import mongoose from "mongoose";
import { Product } from "../types";

const schema = new mongoose.Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: Number, // saved in cents
    avaliability: Number,
    Identifier: String,
    descriptionShort: String,
    descriptionLong: String,
    categoryArray: [String],
  },
  { timestamps: true }
);

export default mongoose.model<Product>("Product", schema);
