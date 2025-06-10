import bcrypt from "bcrypt";
import User from "../models/user";

// import Category from "../models/category";
// import { zodTagToSaveType } from "../types";

export const createUser = async (username: string, password: string) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
  });

  const savedUser = await user.save();
  return savedUser;
};

export const getAllUsers = async () => {
  const allTags = await User.find({});
  return allTags;
};
