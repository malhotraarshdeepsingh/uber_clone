// to load all env variables
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

// to use cors middleware to allow cross-origin requests
const cors = require("cors");
// allowing requests from everywhere
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const connectTDB = require("./utils/db");
connectTDB();

// route to test if server is running
// app.get('/',(req, res) => {
//     res.send('Hello, Express!')
// })

// Importing routes
const userRoutes = require("./routes/user.routes");

// Using routes
app.use('/api/users', userRoutes);

module.exports = app;
