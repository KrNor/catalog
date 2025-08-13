import mongoose, { Document } from "mongoose";

export interface MongooseUser {
  username: string;
  passwordHash: string;
  role: "admin" | "user";
}
export interface UserDocument extends MongooseUser, Document {}

const schema = new mongoose.Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
    minLength: 3,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

const User = mongoose.model<UserDocument>("User", schema);

export default User;
