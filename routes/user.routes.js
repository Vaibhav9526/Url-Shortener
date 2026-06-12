import express from "express";
import { existingUserEmail } from "../middleware/existing_user.middleware.js";
import { signUp } from "../controllers/user.controller.js";
import { signIn } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).json({ error: "invalid session id" });
  if (user.role === "admin") return res.status(200).json("success");
  res.status(200).json(user);
});
router.post("/signup", existingUserEmail, signUp);
router.post("/signin", signIn);

export default router;
