const express = require('express');
const session = require('express-session');

const app = express();
//This is Session save on server side session storage
// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(
  session({
    secret: 'mySecretKey', // Replace with a secure, random key
    resave: false,         // Prevents saving session if it wasn't modified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
      secure: false,        // Set to `true` if using HTTPS
      maxAge: 60000         // Session lifetime in milliseconds (1 minute here)
                            //after 1min session data will lose but session id still on browser
                            //but not valid
    }
  })
);

// Route to set session data
app.get('/set-session', (req, res) => {
  req.session.username = 'JohnDoe';
  res.send('Session data has been set.');
});

// Route to get session data
app.get('/get-session', (req, res) => {
  const username = req.session.username;
  res.send(`Session username: ${username || 'Not set'}`);
});

// Route to destroy the session
app.get('/destroy-session', (req, res) => {
  req.session.destroy((err) => {//delete session data
    if (err) {
      return res.send('Error destroying session');
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.send('Session has been destroyed.');
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:3000');
});
