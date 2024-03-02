const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add the username"]
  },
  email: {
    type: String,
    required: [true, "Please add the email address"],
    unique: [true, "Email address is already taken"]
  },
  password: {
    type: String,
    required: [true, "Please add a password"]
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Users", userSchema);
