import mongoose, { Document } from "mongoose";

export interface MongooseTag {
  tagName: string;
  tagAttributes: string[];
}
export interface TagDocument extends MongooseTag, Document {}

const schema = new mongoose.Schema<TagDocument>(
  {
    tagName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    tagAttributes: [
      {
        type: String,
        trim: true,
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
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

const Tag = mongoose.model<TagDocument>("Tag", schema);

export default Tag;
