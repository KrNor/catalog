import express from "express";

const router = express.Router();

import { createUser, getAllUsers } from "../services/userService";

router.post("/", async (request, response) => {
  const { username, password } = request.body;
  const gottenUser = await createUser(username, password);

  response.status(201).json(gottenUser);
});

router.get("/", async (_req, res) => {
  const products = await getAllUsers();
  // console.log(products);
  res.json(products);
});

export default router;
