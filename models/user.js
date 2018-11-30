const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },
    age: {
        required: true,
        type: Number
    },
    hobbies: {
        required: false,
        type: Array
    },
    weight: {
        required: true,
        type: Array
    }
});


var Users = mongoose.model("Users", UserSchema);

module.exports = {
    Users
};
