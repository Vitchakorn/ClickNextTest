const express = require("express");
const { currBalance, deposit, withdraw, transaction, transferStatement, receiveStatement } = require("../controllers/accountController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();


router.get("/myBalance", validateToken, currBalance);
router.post("/deposit", validateToken, deposit);
router.post("/withdraw", validateToken, withdraw);
router.post("/transaction", validateToken, transaction);
router.get("/transfer", validateToken, transferStatement);
router.get("/receive", validateToken, receiveStatement);

module.exports = router;
