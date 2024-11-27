// to load all env variables
const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const app = express()

// to use cors middleware to allow cross-origin requests
const cors = require('cors')
// allowing requests from everywhere
app.use(cors())

const connectTDB = require('./utils/db')
connectTDB()

// route to test if server is running
app.get('/',(req, res) => {
    res.send('Hello, Express!')
})

module.exports = app