const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies?.authtoken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  const isBlacklisted = await userModel.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    // console.log(decoded.id);
    const user = await userModel.findById(decoded.id);
    
    if (!user) {
        return res.status(401).json({ message: "Invalid token or user not found" });
    }
    
    req.user = user;
    return next();
  } catch (error) {
    res.status(401).json({ message: "Token is invalid" });
  }
};
