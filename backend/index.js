const express = require('express');
const http = require("http");
const app = express();
const path=require('path');
const cookiesparser=require('cookie-parser');
const cors=require('cors');
const connectDB = require('./db/connectDB')
const authRoutes = require('./Routes/auth.route');
const googlesgeetRoute=require('./Routes/googlesheet.routes')
const createWebSocketServer = require('./server/websocketServer');
const mongoose  = require('mongoose');
const PORT = process.env.PORT||5000;
//use middleware
app.use(express.json())//allows to allowing req.body
app.use(cookiesparser())//allows pasre cookies
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))


app.use('/api/auth', authRoutes);
app.use('/',googlesgeetRoute);
if (process.env.NODE_ENV === "production") {
	// Serve static files from the "dist" folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve `index.html`
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
}
const server = http.createServer(app);

 // Attach WebSocket server to the HTTP server
createWebSocketServer(server);

// Start the server
server.listen(PORT, () => {
  mongoose.connect(process.env.AUTH_MONGODB_URL).then(()=>{
    console.log('Connected mongoDB')
  })
  console.log(`Server is running on http://localhost:${PORT}`);
});