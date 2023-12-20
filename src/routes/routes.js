const express = require("express");
const middleware = require("../middleware/verify.js");
const { createUser, loginUser } = require("../controller/user.js");
const authController = require("../api/auths/authController.js");
const usersController = require("../api/users/usersController.js");
const storageController = require("../api/storages/storageController.js");

const router = express.Router();

router.post("/registerOld", createUser);
router.post("/loginOld", loginUser);
router.get("/auth/loginOld", middleware, (req, res) => {
  res.status(200).json({
    message: "Token valid",
    data: {
      id: req.user.payload.id,
      username: req.user.payload.username,
      email: req.user.payload.email,
    },
  });
});

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", middleware, authController.logout);
router.get("/profile", middleware, authController.profile);

router.get("/users", middleware, usersController.getUsers);
router.get("/users/:id", middleware, usersController.getUser);
router.post("/users", middleware, usersController.createUser);
router.put("/users/:id", middleware, usersController.updateUser);
router.delete("/users/:id", middleware, usersController.deleteUser);

router.post("/uploads", storageController.uploadFile);
router.get("/uploads/:filename", storageController.getFile);

module.exports = router;
