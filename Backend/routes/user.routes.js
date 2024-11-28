const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");

router.post(
  "/register",
  [
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullName.firstName')
      .isLength({ min: 2 })
      .withMessage("First Name must be a two characters long"),
    body('password')
      .isLength({ min: 8 })
      .withMessage("Password must be a 8 characters long"),
  ],
  userController.registerUser
);

module.exports = router;
