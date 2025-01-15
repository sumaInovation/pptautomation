const jwt=require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken; // Read token from cookies
    if (!token) return res.status(401).json({success:false, message: "Unauthorized " });
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;//user detail(currentuser)
      next();
    } catch (err) {
      res.status(401).json({success:false, message: "Invalid token" });
    }
  };

  module.exports=verifyToken