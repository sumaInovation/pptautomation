
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Google authentication endpoint
const VerificationGoogleTokent=async(req,res,next)=>{
    const {credential,email,password } = req.body;
    
    if(!credential){
      req.email=email;
      req.password=password;
    
      
      next()
     }else{
        try {
            // Verify the token
            const ticket = await client.verifyIdToken({
              idToken: credential,
              audience: process.env.GOOGLE_CLIENT_ID,
            });
        
            const payload = ticket.getPayload();
        
            const { sub, email, name, picture } = payload;
             req.google_ID=sub,
             req.email=email,
             req.picture=picture
             req.name=name;
            next();
    
    
          } catch (error) {
            return res.status(400).json({success:false,message:'google not provide token'})
          }
    
        }


}

module.exports=VerificationGoogleTokent