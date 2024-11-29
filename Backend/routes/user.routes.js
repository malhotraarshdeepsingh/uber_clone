const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullName.firstName")
      .isLength({ min: 2 })
      .withMessage("First Name must be a two characters long"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be a 8 characters long"),
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be a 8 characters long"),
  ],
  userController.loginUser
);

router.post("/profile", authMiddleware.authUser ,userController.getUserProfile);

module.exports = router;
