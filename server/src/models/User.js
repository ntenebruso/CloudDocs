const { Schema, model } = require("mongoose");

const User = new Schema({
    username: String,
    password: String
});

module.exports = model("User", User);