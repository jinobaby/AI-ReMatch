// Copyright (c) 2025 Jino Baby
// This file is licensed under the MIT License.

// Import required modules
var express = require('express');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var cors = require('cors');

var app = express();

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MongoDB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    })



// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cors());         // Enable Cross-Origin Resource Sharing

// Import routers
var AdminRouter = require('./src/routes/AdminRouter');
var UserRouter = require ('./src/routes/UserRouter');


// Register routers
app.use('/Admin', AdminRouter);
app.use('/User', UserRouter)

// Start the server on port 5000
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
