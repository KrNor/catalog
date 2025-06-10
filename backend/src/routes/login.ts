import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

import User from "../models/user";

router.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: "invalid username or password",
    });
    return;
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET as string, {
    expiresIn: 60 * 60, // expires in 1 hour
  });

  // console.log(userForToken);
  // const token = jwt.sign(userForToken, process.env.SECRET as string);
  res.status(200).send({ token, username: user.username });
  return;
});

export default router;
