const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  transferor: {
    type: String,
  },
  transferee: {
    type: String,
  },
  amount: {
    type: Number,
    set: v => Math.round(v * 100) / 100,
  },
  method:{
    type: String,
  },
  time: {
    type: Date,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Transactions", userSchema);