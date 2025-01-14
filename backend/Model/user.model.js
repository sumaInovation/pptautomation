const mongoose=require('mongoose');
const userSchema=new mongoose .Schema({
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true,
},
name:{
    type:String,
    required:true, 
},
lastlogin:{
    type:Date,
    default:Date.now()
},
isVerified:{
    type:Boolean,
    default:false
},
resetPasswordToken:String,
resetPasswordExpiresAt:Date,
verificationToken:String,
verificationTokenExpireAt:Date,
googleID:String,
picture:String,
},{timestamps:true})
module.exports=mongoose.model('user',userSchema);