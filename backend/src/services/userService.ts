import bcrypt from "bcrypt";
import User, { UserDocument } from "../models/user";

// import Category from "../models/category";
// import { zodTagToSaveType } from "../types";

export const createUser = async (
  username: string,
  password: string
): Promise<UserDocument> => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
  });

  const savedUser: UserDocument = await user.save();
  return savedUser;
};

export const getAllUsers = async (): Promise<UserDocument[]> => {
  const allTags: UserDocument[] = await User.find({});
  return allTags;
};
