const mongoose = require("mongoose");

const Message = new mongoose.Schema({
    message: String,
});

module.exports = mongoose.model("user",Message);