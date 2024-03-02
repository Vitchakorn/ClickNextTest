const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel")
const Account = require("../models/AccountModel")


function generateRandom10DigitNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

const createAccount = asyncHandler(async (req,res) => {
    try {
      const userId = req.user.id;
        if (!userId) {
            res.status(400);
            throw new Error("Create Account Error")
        }

        const accNo = generateRandom10DigitNumber();

        const transaction = await Account.create({
            owner: req.user.id,
            accountNumber: accNo,
        });
            
        res.json({ message: "Create account successful" });
      
    } catch (error) {
      console.error("Error deposit:", error);
      res.status(500).json({ error: error.message });
    }
});

module.exports = { createAccount };