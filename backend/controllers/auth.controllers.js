const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../Model/user.model');
const generateTokenAndsetCookies = require('../utils/generateTokenAndsetCookies')
const VerifyGoogletoken = require('../utils/VerifyGoogletoken')

const singup = async (req, res, next) => {
    try {
        const { email, password, name, credential } = req.body;
        let user = null;
        if (credential) {
            //verify google token frist
            const newuser = await VerifyGoogletoken(credential)
            if (newuser == null) return res.status(400).json({ success: false, message: 'Google acount not valid!' });
            const email = newuser.email
            const userAlreadyExsist = await User.findOne({ email });
            if (userAlreadyExsist) return res.status(400).json({ success: false, message: 'User aleady exsist' });

            user = new User({
                googleID: newuser.sub,
                email: newuser.email,
                password: "#",
                name: newuser.name,
                picture: newuser.picture,
                verificationToken: Math.floor(100000 + Math.random() * 900000).toString(),
                verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000
            });


        } else {

            if (!email || !password || !name) throw new Error('All Fields are Required!');
            const userAlreadyExsist = await User.findOne({ email });
            if (userAlreadyExsist) return res.status(400).json({ success: false, message: 'User aleady exsist' });
            const hashedpassword = await new bcrypt.hash(password, 10);
            user = new User({
                googleID: "#",
                email,
                password: hashedpassword,
                name,
                verificationToken: Math.floor(100000 + Math.random() * 900000).toString(),
                verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000
            });

        }

        await user.save();
        //jwt create
        //generateTokenAndsetCookies(res, user._id);
        return res.status(201).json({
            success: true,
            message: 'User Acount Created Successfully',

        })
        //email verifications


    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });


    }



}

const login = async (req, res, next) => {
    const { email, password, name, credential } = req.body;
    let newuser = null;
    if (credential) newuser = await VerifyGoogletoken(credential);
    if (newuser == null && credential) return res.status(401).json({ success: false, message: 'Invalid Credintials google' })


    try {
        let user = null;
        if (credential) { user = await User.findOne({ email: newuser.email }) }
        else {

            user = await User.findOne({ email })
            if (!user) return res.status(401).json({ success: false, message: 'Invalid Credintials' })
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(400).json({ success: false, message: 'Incorrect password' })
        }
        if(user){generateTokenAndsetCookies(res, user._id);
        user.lastlogin = new Date();
        await user.save();
        return res.status(201).json({
            success: true,
            message: 'User Created Successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        })
    }else{
        return res.status(400).json({ success: false, message: 'Please try again' })  
    }

    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, message: err.message });

    }
}

const logout = async (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' })

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
    try {
        const user = await User.findById(req.userID).select("-password");
        if (!user) return res.status(400).json({ success: false, message: 'Not User Found!' })
        return res.status(200).json({ success: true, message: user });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }

}

module.exports = { singup, login, logout, forgetPassword, resetPassword, checkAuth }