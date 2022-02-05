const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const Document = new Schema({
    _id: String,
    name: String,
    data: Object,
    userId: mongoose.ObjectId
})

module.exports = model("Document", Document);