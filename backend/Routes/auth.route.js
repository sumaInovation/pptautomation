const express = require('express');
const router = express.Router();
const { login, singup, logout,forgetPassword,resetPassword,checkAuth } = require('../controllers/auth.controllers');
const VerificationGoogleTokent=require('../middleware/VerificationGoogleTokent')
const verifyToken=require('../middleware/Verifyjwt')
router.get('/check-auth',verifyToken,checkAuth)
router.post('/singup',VerificationGoogleTokent, singup)
router.post('/login', VerificationGoogleTokent,login);
router.get('/logout', logout);
router.post('/forget-password',forgetPassword)
router.post('/reset-password/:token',resetPassword);
module.exports = router;