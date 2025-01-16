const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../Model/user.model');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const passport = require('passport');


const singup = async (req, res, next) => {

    try {
        const userAlreadyExsist = await User.findOne({ email: req.email });
        if (userAlreadyExsist) return res.status(400).json({ success: false, message: 'User aleady exsist' });
        const newUser = {};

        if (req.email) newUser.email = req.email;
        if (req.password) newUser.password = req.password;
        if (req.name) newUser.name = req.name;
        if (req.picture) newUser.picture = req.picture;
        if (req.googleID) newUser.googleID = req.googleID;
        newUser.verificationToken = Math.floor(100000 + Math.random() * 900000).toString(),
        newUser.verificationTokenExpireAt = Date.now() + 24 * 60 * 60 * 1000


        const user = new User(newUser);

        await user.save();

        return res.status(201).json({
            success: true,
            message: 'User Acount Created Successfully',

        })
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });

    }



}

const login = async (req, res, next) => {
    try {
         const userExsist = await User.findOne({ email: req.email });
         const userObj = userExsist.toObject(); // Convert Mongoose document to plain object
                        delete userObj.password;
        if (!userExsist) return res.status(400).json({ success: false, message: 'Not register user' });
        if (userExsist.password != req.password) return res.status(400).json({ success: false, message: 'Incorrect Password' });
       
            const token=jwt.sign({user:userObj},process.env.JWT_SECRET,{expiresIn:'1h'})
             
  // Set token as a cookie
   res.cookie("authToken", token, {
    httpOnly: true, // Prevent access via JavaScript
    secure: process.env.NODE_ENV === "production", // Send only over HTTPS
    sameSite: "Strict", // Protect against CSRF
    maxAge: 3600000, // 1 hour in milliseconds
  });
return res.json({ message: "Login successful" });
} catch (err) {
    return res.status(400).json({ success: false, message: err.message });
}

}

const logout = async (req, res, next) => {
    //Delete cookies
    res.clearCookie("authToken");
    res.json({success:true, message: "Logged out successfully" });
    
}

const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: 'Not User Found!' })
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000;//1hr
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpireAt;
        await user.save();
        //send email(pass utl wiht params resetToken)




    } catch (err) {
        return res.status(400).json({ success: false, message: err });


    }

}
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid or Expired Token' })
        //update password
        const hashedpassword = await bcrypt.hash(password, 10);
        user.password = hashedpassword;
        await user.save();
        res.status(201).json({ success: true, message: 'Updated password successfully!' })

    } catch (err) {
        res.status(400).json({ success: false, message: err });
    }
}

const checkAuth = async (req, res, next) => {
      res.status(200).json({success:true,message:req.user})

}

module.exports = { singup, login, logout, forgetPassword, resetPassword, checkAuth }