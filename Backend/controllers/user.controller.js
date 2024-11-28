const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
  
  // console.log(req.body);

  // Check for a valid user request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  // to hash the password
  const hashedPassword = await userModel.hashPassword(password);

  // then save the new user in db
  const newUser = await userService.createUser({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashedPassword,
  })

  // generate auth token for user
  const authtoken = newUser.generateAuthToken();

  // send the user and token back to client
  res.status(201).json({ user: newUser, authtoken });
};
