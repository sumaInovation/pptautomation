import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WebSocketProvider } from './context/WebSocketContext.jsx'; // Import WebSocket provider
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <WebSocketProvider>
        <App />
        </WebSocketProvider>
      
       
   </StrictMode>,
)
