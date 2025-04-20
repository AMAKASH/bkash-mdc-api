const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    minlength: 6,
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please Provide Valid Email"],
    unique: true,
  },

  enabled: {
    type: Boolean,
    default: false,
  },
});

AdminSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

AdminSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.name },
    process.env.JWT_SECRET_ADMIN,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

AdminSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Admin", AdminSchema);
