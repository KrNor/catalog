import mongoose, { Document, Types } from "mongoose";

export interface MongooseCategory {
  name: string;
  description: string;
  parent: Types.ObjectId;
  lineage: Types.ObjectId[];
}

export interface CategoryDocument extends MongooseCategory, Document {}

const schema = new mongoose.Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: { type: String, required: true, trim: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    lineage: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
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

const Category = mongoose.model<CategoryDocument>("Category", schema);

export default Category;
