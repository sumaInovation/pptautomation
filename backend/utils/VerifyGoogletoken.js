
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Google authentication endpoint
const VerifyGoogletoken=async(token)=>{
    try {
        // Verify the token
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
    
        const payload = ticket.getPayload();
    
        const { sub, email, name, picture } = payload;
         const newuser={sub,email,name,picture};
         return newuser


      } catch (error) {
        console.error("Error verifying Google token:", error);
        return null
      }


}

module.exports=VerifyGoogletoken