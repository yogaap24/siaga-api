import express from "express";
import { createUser, loginUser } from "../controller/user.js";
import { middleware } from "../middleware/verify.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/auth/login", middleware, (req, res) => {
  res.status(200).json({
    message: "Token valid",
    data: {
      id: req.user.payload.id,
      username: req.user.payload.username,
      email: req.user.payload.email,
    },
  });
});

export default router;
