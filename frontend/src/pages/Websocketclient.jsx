import React, { useState, useEffect } from 'react';

 const WebSocketClient = () => {
 const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [status, setStatus] = useState('Disconnected');
  useEffect(() => {
    // Create a new WebSocket connection when the component mounts
    const socket = new WebSocket('ws://localhost:5000'); // URL of your WebSocket server

    socket.onopen = () => {
      console.log('Connected to the WebSocket server');
      setStatus('Connected');
    };

    socket.onclose = () => {
      console.log('Disconnected from the WebSocket server');
      setStatus('Disconnected');
    };

    socket.onmessage = (event) => {
      // Handle received message
     const incomingMessage = JSON.parse(event.data);
      const{Lenght,state}=incomingMessage;
      
      console.log(incomingMessage)
      //setReceivedMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Store the WebSocket instance in state
    //setWs(socket);

    // Cleanup WebSocket connection when component unmounts
    return () => {
      socket.close();
    };
  }, []);

  // Function to send a message to the server
  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageToSend = JSON.stringify({ event: 'chat', data: message });
      ws.send(messageToSend);
      setMessage('');
    } else {
      console.log('WebSocket is not connected.');
    }
  };

  return (
    <div>
      <h2>WebSocket Client</h2>
      <p>Status: {status}</p>

      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>

      <h3>Received Messages</h3>
      <div>
        {receivedMessages.length > 0 ? (
          <p>neme:{linechrtdata} age:{piechartdata}</p>
        ) : (
          <p>No messages received yet.</p>
        )}
      </div>
    </div>
  );
};

export default WebSocketClient;
