const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const isValidEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const registerUser = async (req, res) => {
    try {
      console.log(req.body);
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
      }
  
      if (!isValidEmailFormat(email)) {
        res.status(400);
        throw new Error("Invalid email format");
      }
  
      const userAvailable = await User.findOne({ email });
      if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
  
      res.json({ message: "Registered the user", result: user.res });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: error.message });
    }
  };


const loginUser = asyncHandler(async (req,res) => {
    try {
        console.log(req.body);
        const {email, password} = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error("This email address is not registered");
        }

        if(!email || !password) {
            res.status(400);
            throw new Error("All fields are mandatiry!");
        }

        if(user && (await bcrypt.compare(password, user.password))){
            const accessToken = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id
                }}, 
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
            );
            return res.json({token: accessToken});
        }else {
            res.status(401);
            throw new Error("email or password is invalid");
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
    
});

module.exports = { loginUser, registerUser };