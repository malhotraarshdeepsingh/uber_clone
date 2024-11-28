const userModel = require("../models/user.model");

// Function to create a new user in db
module.exports.createUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  if (!firstName || !email || !password) {
    throw new Error("All fields are required");
  }

  const user = userModel.create({
    fullName: { firstName, lastName },
    email,
    password: password,
  });

  return user;
};
