const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: String,
    email: {type: String, trim: true, lowercase: true, required: true},
    password: {type: String, required: true},
    wallet: {type: Number},
});

module.exports = new mongoose.model("User", userSchema)
