const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0.00,
    },
    accountNumber: {
        type: String,
    },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Accounts", accountSchema);
