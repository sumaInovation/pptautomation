import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a WebSocket context
const WebSocketContext = createContext();

// WebSocket Provider Component
export const WebSocketProvider = ({ children }) => {
  const [wsClient, setWsClient] = useState(null); // WebSocket client
  const [messages, setMessages] = useState([]); // Messages received from WebSocket
  
  //Websocket comming parameters
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const socketUrl = `${protocol}//${window.location.host}/ws`; // Adjust `/ws` if your WebSocket endpoint differs


  // Create WebSocket client and handle events
  useEffect(() => {
    const socket = new WebSocket(socketUrl); // Replace with your WebSocket URL

    // Event listener for when the WebSocket opens
    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    // Event listener for incoming messages
    socket.onmessage = async(event) => {
    try{
        setMessages(await JSON.parse(event.data))
        console.log("incomming")
      
    }catch(e){
      console.log("Error :",e);
    }

       };

    // Event listener for WebSocket errors
    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Cleanup WebSocket connection on unmount
    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWsClient(socket); // Store the WebSocket client

    return () => {
      socket.close(); // Close the WebSocket when the component unmounts
    };
  }, []);

  // Function to send a message
  const sendMessage = (message) => {
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
      wsClient.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ wsClient, messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to access WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
