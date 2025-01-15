const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../Model/user.model');

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
       
        if (!userExsist) return res.status(400).json({ success: false, message: 'Not register user' });
        if (!req.password) {
            //set session and cookies for front end
            
            req.session.user =userExsist
            return res.status(200).json({ success: true, message: 'Google Login successful' })
        }
        if (userExsist.password != req.password) return res.status(400).json({ success: false, message: 'Incorrect Password' });
        //set session and cooies for front end
        req.session.user = userExsist
        return res.status(200).json({ success: true, message: 'Traditinal Login successful' })
        if (userExsist.password != req.passport) return res.status(400).json({ success: false, message: 'Incorrect Password' });



    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });

    }

}

const logout = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).json({ success: false, message: 'Error logout' });
        }
        return res.status(200).json({ success: true, message: 'Logged out successfully' })
    })


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
    console.log('involed')
    try {
        if (req.session.user) {
            return res.status(200).json({ success: true, message: req.session.user });
        } else {
            return res.status(401).json({ success: false, message: 'No user logged in' });
        }

    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }

}

module.exports = { singup, login, logout, forgetPassword, resetPassword, checkAuth }