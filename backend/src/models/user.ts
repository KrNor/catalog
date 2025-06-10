import mongoose from "mongoose";

interface User extends mongoose.Document {
  username: string;
  passwordHash: string;
  role: "admin" | "user";
}

const schema = new mongoose.Schema<User>({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  passwordHash: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    required: true,
    default: "user",
  },
});

schema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

export default mongoose.model("Users", schema);
