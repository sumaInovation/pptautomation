const express = require("express");
const cors=require('cors');
const app=express();
const mongoose=require('mongoose');
const session=require('express-session');
const cookieParser = require('cookie-parser');
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));
app.use(cookieParser());
app.get('/set-cookie',(req,res)=>{
    res.cookie('name','sumanga',{httpOnly:true});
    res.json({message:'set cookie'});
})
app.get('/get-cookie',(req,res)=>{
    const name=req.cookies.name;
    res.json({message:name});
})

app.get('/delete-cookie',(req,res)=>{
    res.clearCookie('name');
    res.json({message:'removed'});
})




app.listen(5000,()=>console.log('sever is running'))