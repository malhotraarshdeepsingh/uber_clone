const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");

module.exports.registerCaptain = async (req, res, next) => {
  // Check user request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  try {
    // verify if email is already registered
    const isCaptainAlreadyExist = await captainModel.findOne({ email });
    if (isCaptainAlreadyExist) {
      return res.status(400).json({ message: "Captain already exist" });
    }
  
    const hashedPassword = await captainModel.hashPassword(password);
  
    // Create a new captain in the database
    const captain = await captainService.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });
  
    // Generate and send JWT token to the client
    const token = captain.generateAuthToken();
    res.status(201).json({ token, captain });
  } catch (error) {
    return res.status(500).json({ error: error || "Internal Server Error" });
  }
};

module.exports.loginCaptain = async (req, res, next) => {
  // check req
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // find user by email and extract password from db
    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // compare the password from request with the password in db
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate and send JWT token to the client
    const token = captain.generateAuthToken();
    res
        .cookie("token", token)
        .status(200)
        .json({ token, captain });
  } catch (error) {
    return res.status(500).json({ error: error || "Internal Server Error" });
  }
};
module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};
module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  
  await blackListTokenModel.create({ token });
  
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successfully" });
};
