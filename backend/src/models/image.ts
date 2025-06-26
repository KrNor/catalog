import mongoose, { Document } from "mongoose";

export interface MongooseImage {
  url: string;
  publicId: string;
}

export interface ImageDocument extends MongooseImage, Document {}

const schema = new mongoose.Schema<ImageDocument>(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: { type: String, required: true, unique: true },
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

const Image = mongoose.model<ImageDocument>("Image", schema);

export default Image;
