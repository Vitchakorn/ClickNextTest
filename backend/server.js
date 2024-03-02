const express = require('express')
const app = express()
const mongoose = require('mongoose')
const expressSession = require('express-session')
const flash = require('connect-flash')
const cors = require('cors')
const connectDb = require("./config/dbConnection")
const dotenv = require("dotenv").config();

connectDb();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(flash())

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/account", require("./routes/transactionRoutes"));
app.use("/api/user", require("./routes/accountRoutes"));

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})