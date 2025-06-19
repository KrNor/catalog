import express from "express";

const router = express.Router();

import { createUser, getAllUsers } from "../services/userService";

import {
  authenticateToken,
  authenticateAdmin,
} from "../middleware/authMiddleware";

router.use(authenticateToken, authenticateAdmin);

router.post("/", async (request, response) => {
  const { username, password } = request.body;
  const gottenUser = await createUser(username, password);

  response.status(201).json(gottenUser);
});

router.get("/", async (_req, res) => {
  const products = await getAllUsers();
  res.json(products);
});

export default router;
