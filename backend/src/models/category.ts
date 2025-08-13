import mongoose, { Document, Types } from "mongoose";

export interface MongooseCategory {
  name: string;
  description: string;
  parent: Types.ObjectId;
  lineage: Types.ObjectId[];
  productCount: number;
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
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

schema.set("toJSON", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

const Category = mongoose.model<CategoryDocument>("Category", schema);

export default Category;
