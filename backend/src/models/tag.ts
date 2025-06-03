import mongoose from "mongoose";
import { Tag } from "../types";

const schema = new mongoose.Schema<Tag>(
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
  },
});

export default mongoose.model("Tags", schema);
