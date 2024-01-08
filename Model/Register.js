const mongoose = require("mongoose");
const { Schema } = mongoose;

const Register = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  contact: { type: Number, required: true },
});

module.exports = mongoose.model("Register", Register);
