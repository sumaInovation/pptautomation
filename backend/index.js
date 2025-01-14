const express = require('express');
const session=require('express-session');
const app = express();
const path=require('path');
const cookiesparser=require('cookie-parser');
const cors=require('cors');
const connectDB = require('./db/connectDB')
const authRoutes = require('./Routes/auth.route');
const PORT = process.env.PORT||5000;
//use middleware
app.use(express.json())//allows to allowing req.body
app.use(cookiesparser())//allows pasre cookies
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(
  session({
    secret: 'yourSecretKey', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure:process.env.NODE_ENV==='production',
      maxAge: 24*60*60 * 1000, // 1 day
    },
  })
);

app.use('/api/auth', authRoutes);
if (process.env.NODE_ENV === "production") {
	// Serve static files from the "dist" folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve `index.html`
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
}


app.listen(PORT, () => {
    connectDB();
    console.log(`Server Running on port:${PORT}`)
});      