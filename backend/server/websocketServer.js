const { WebSocketServer } = require("ws");
const WriteDataOnGoogleSheet = require('../controllers/writedata.controller')

const createWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    console.log("Client connected");

    // Handle messages received from a client
    ws.on("message", async (message) => {
      const parsedMessage = JSON.parse(message.toString()); // Convert buffer to string
      console.log("Received:", parsedMessage);
      const { reason } = parsedMessage;
      if (reason) {
        await WriteDataOnGoogleSheet(parsedMessage)}
      // Broadcast the message to all other clients except the sender
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString()); // Send the message to the client
        }
      });
    });





    ws.on("close", () => {
      console.log("Client disconnected");
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
    });
  });


  console.log("WebSocket server is ready");
};

module.exports = createWebSocketServer;
