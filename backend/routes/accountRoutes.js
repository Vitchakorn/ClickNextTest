const express = require("express");
const { createAccount } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();


router.get("/createAccount", validateToken, createAccount);

module.exports = router;
