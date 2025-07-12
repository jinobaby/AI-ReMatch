var mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    adminEmail: String,
    adminPassword: String

});

module.exports = mongoose.model('Admin-data', adminSchema);