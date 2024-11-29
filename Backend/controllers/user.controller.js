const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  // console.log(req.body);

  // Check for a valid user request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  // to check if the user already exist in db
  const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).json({ message: 'User already exist' });
    }

  try {
    // to hash the password
    const hashedPassword = await userModel.hashPassword(password);

    // then save the new user in db
    const newUser = await userService.createUser({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashedPassword,
    });

    // generate auth token for user
    const authtoken = newUser.generateAuthToken();

    // remove password from user response before sending it back to client
    const userResponse = newUser.toObject();
    delete userResponse.password;

    // send the user and token back to client
    res.status(201).json({ user: userResponse, authtoken });
  } catch (error) {
    return res.status(500).json({ error: error || "Internal Server Error" });
  }
};

module.exports.loginUser = async (req, res, next) => {
  // Check for a valid user request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // find user by email and extract password from db
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // compare the password from request with the password in db
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // remove password from user response before sending it back to client
    const userResponse = user.toObject();
    delete userResponse.password;

    const authtoken = await user.generateAuthToken();
    res
      .status(200)
      .cookie("authtoken", authtoken)
      .json({ authtoken, user: userResponse });
  } catch (error) {
    return res.status(500).json({ error: error || "Internal Server Error" });
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  const token = req.cookies.authtoken || req.headers.authorization.split(" ")[1];
  
  await blacklistTokenModel.create({token})

  res
    .status(200)
    .clearCookie("authtoken")
    .json({ message: "Logged out successfully" });
};
