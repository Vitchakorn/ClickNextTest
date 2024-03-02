const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel")
const Account = require("../models/AccountModel")
const Transaction = require("../models/TransactionModel")


// your balance 
const currBalance = async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        res.status(400);
        throw new Error("Fetch Balance User Error")
      }

      const account = await Account.findOne({owner: userId});
      if (!account) {
        res.status(400).json({ error: "this user no account" });
      } else {
        console.log(account);
      }
  
      res.json(account.balance);
    } catch (error) {
      console.error("Error user balance:", error);
      res.status(500).json({ error: error.message });
    }
  };


// deposit method
const deposit = asyncHandler(async (req,res) => {
    try {
      const amount = parseFloat(req.body.amount); 
      const userId = req.user.id;
      if (!userId) {
        res.status(400);
        throw new Error("Fetch Balance Account Error")
      }

      const account = await Account.findOne({owner: userId});
      if (!account) {
          res.status(400);
          throw new Error("user id error");
      } else {
          const newBalance = account.balance + amount;

          const updatedAccount = await Account.findOneAndUpdate(
              { owner: userId }, 
              { $set: { balance: newBalance } }, 
              { new: true } 
          );

          await Transaction.create({
            transferee: req.user.id,
            receive: req.user.username,
            amount: amount,
            method: "deposit",
          });
            
          res.json({
              message: "Deposit successful",
              balance: updatedAccount.balance,
              account: updatedAccount
          });
      }
    } catch (error) {
      console.error("Error deposit:", error);
      res.status(500).json({ error: error.message });
    }
});


// withdraw method
const withdraw = asyncHandler(async (req,res) => {
    try {
      const amount = parseFloat(req.body.amount); 
      const userId = req.user.id;
      if (!userId) {
        res.status(400);
        throw new Error("Fetch Balance User Error")
      }

      const account = await Account.findOne({owner: userId});
      if (!account) {
          res.status(400);
          throw new Error("user id error");
      } else {
        if (account.balance > amount) {
          const newBalance = account.balance - amount;
          const updatedAccount = await Account.findOneAndUpdate(
              { owner: userId }, 
              { $set: { balance: newBalance } }, 
              { new: true } 
          );

          await Transaction.create({
            transferor: req.user.id,
            transfer: req.user.username,
            amount: amount,
            method: "withdraw",
          });
            
          res.json({
              message: "Withdraw successful",
              balance: updatedAccount.balance,
              account: updatedAccount
          });
        } else {
          res.status(400).json({ error: "Not enough money" });
        }
      }
    } catch (error) {
      console.error("Error withdraw:", error);
      res.status(500).json({ error: error.message });
    }
});


// transaction method
const transaction = asyncHandler(async (req,res) => {
    try {
      const amount = parseFloat(req.body.amount); 
      const destination = req.body.destination;
      const userId = req.user.id;
      if (!userId) {
        res.status(400);
        throw new Error("Fetch Balance User Error")
      }

      const destinationAccount = await Account.findOne({accountNumber: destination});

      const account = await Account.findOne({owner: userId});
      if (!account) {
          res.status(400);
          throw new Error("user id error");
      } else {
        if (account.balance > amount) {
          const newMe = account.balance - amount;
          await Account.findOneAndUpdate(
              { owner: userId }, 
              { $set: { balance: newMe } }, 
              { new: true } 
          );

          const newBalance = destinationAccount.balance + amount;
          await Account.findOneAndUpdate(
              { owner: destination }, 
              { $set: { balance: newBalance } }, 
              { new: true } 
          );

          await Transaction.create({
            transferor: userId,
            transferee: destinationAccount.owner,
            amount: amount,
            method: "transaction",
          });
            
          res.json({ message: "transaction successful" });
        } else {
          res.status(400).json({ error: "Not enough money" });
        }
      }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
});


// get transfer statement
const transferStatement = asyncHandler(async (req,res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      res.status(400);
      throw new Error("Fetch Statement User Error")
    }

    const transactions = await Transaction.find({ transferor: userId }).lean();
    if (!transactions) {
      res.status(400).json({ error: "this user no account" });
    }

    for (let transaction of transactions) {
      if (transaction.transferor) {
        const transfer = await User.findOne({_id: transaction.transferor});
        transaction.transfer = transfer.username
      }
      if (transaction.transferee) {
        const receive = await User.findOne({_id: transaction.transferee});
        transaction.receive = receive.username
      }
    };

    res.json(transactions);
  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: error.message });
  }
});


// get receive statement
const receiveStatement = asyncHandler(async (req,res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      res.status(400);
      throw new Error("Fetch Statement User Error")
    }

    const transactions = await Transaction.find({ transferee: userId }).lean();
    if (!transactions) {
      res.status(400).json({ error: "this user no account" });
    } else {
      console.log(transactions);
    }

    for (let transaction of transactions) {
      if (transaction.transferor) {
        const transfer = await User.findOne({_id: transaction.transferor});
        transaction.transfer = transfer.username
      }
      if (transaction.transferee) {
        const receive = await User.findOne({_id: transaction.transferee});
        transaction.receive = receive.username
      }
    };

    res.json(transactions);
  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: error.message });
  }
});

module.exports = { currBalance, deposit, withdraw, transaction, transferStatement, receiveStatement };