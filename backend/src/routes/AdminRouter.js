// Copyright (c) 2025 Jino Baby
// This file is licensed under the MIT License.

// Import required modules
var router = require('express').Router();
var crypto = require('crypto-js');
var AdminSchema = require('../models/AdminSchema');
var JWT = require('jsonwebtoken');

// =======================
// Admin Registration Route
// =======================
// Endpoint: POST /Admin/Admin-reg
// Request Body: { adminEmail, adminPassword }
// Description: Registers a new admin by encrypting the password and saving to DB.
router.post('/Admin-reg', async (req, res) => {
    console.log("Admin registration request received:", req.body);
    try {
        // Encrypt the password using crypto-js and a secret from environment variables
        var AdminPassword = crypto.AES.encrypt(
            req.body.adminPassword, process.env.pasdword
        ).toString();

        // Create a new admin document
        var newAdmin = new AdminSchema({
            adminEmail: req.body.adminEmail,
            adminPassword: AdminPassword
        });

        // Save the new admin to the database
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error during admin registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin Login Route
// Endpoint: POST /Admin/Admin-login
// Request Body: { adminEmail, adminPassword }
// Description: Authenticates admin, decrypts password, and returns JWT token if valid.
router.post('/Admin-login', async (req, res) => {
    console.log("Admin login request received:", req.body);
    try {
        // Find admin by email
        var findedEmailData = await AdminSchema.findOne({ adminEmail: req.body.adminEmail });
        if (!findedEmailData) {
            return res.status(404).json({ message: 'Admin not found' });
        } else {
            console.log("Admin found:", findedEmailData);

            // Decrypt the stored password using crypto-js and the same secret
            var bytes = crypto.AES.decrypt(
                findedEmailData.adminPassword, process.env.pasdword
            );
            var realPassword = bytes.toString(crypto.enc.Utf8);
            console.log("Decrypted password:", realPassword);

            // Compare provided password with decrypted password
            if (req.body.adminPassword === realPassword) {
                // Create JWT token with admin ID and secret key from environment variables
                var token = JWT.sign(
                    { id: findedEmailData._id },
                    process.env.SECRET_KEY,
                    { expiresIn: '10d' }
                );
                console.log("Token generated:", token);

                // Send token and admin ID to the client
                res.status(200).json({ Token: token, Id: findedEmailData._id });
            } else {
                res.status(401).json({ message: 'Incorrect password' });
            }
        }
    } catch (error) {
        console.log("Error during admin login:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Export the router to be used in index.js
module.exports = router;
