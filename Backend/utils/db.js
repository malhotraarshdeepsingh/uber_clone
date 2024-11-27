const mongoose = require('mongoose');

// Connects to the database
function connectToDB(){
    mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => console.log('Connected to DB'))
    .catch(err => console.error('Failed to connect to DB', err));
}

module.exports = connectToDB;