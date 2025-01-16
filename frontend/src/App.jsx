import React, { useState, useEffect, Children } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Homepage from './pages/Homepage'
import Dashbordpage from './pages/Dashbordpage';
import Loginpage from './pages/Loginpage'
import Signuppage from './pages/Signuppage';
import Navbar from './components/common/Navbar'
import useAuthSrore from './store/useAuthStore'
import WebSocketClient from './pages/Websocketclient';
import MachineDataForm from './pages/filterdata'
const App = () => {
  const{checkAuth}=useAuthSrore()
//Ever Re-rendering get user details from cooies
  useEffect(()=>{
   checkAuth();
  },[checkAuth])



  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

 
    <BrowserRouter >
      <Navbar/>
    <Routes>
      <Route path='/' element={<WebSocketClient/>}/>
      <Route path='/login' element={<Loginpage/>}/>
      <Route path='/signup' element={<Signuppage/>}/>
      <Route path='/dashboard' element={<Dashbordpage/>}/>
      <Route path='/filter' element={<MachineDataForm/>}/>
    </Routes>
  
  </BrowserRouter>
  </GoogleOAuthProvider>
  
)
}

export default App
