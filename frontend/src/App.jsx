import React, { useState, useEffect, Children } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Homepage from './pages/Homepage'
import Dashbordpage from './pages/Dashbordpage';
import Loginpage from './pages/Loginpage'
import Signuppage from './pages/Signuppage';
import Navbar from './components/common/Navbar'
import useAuthSrore from './store/useAuthStore'
const App = () => {
  const{login,isLoading,error,user,checkAuth}=useAuthSrore()
//Ever Re-rendering get user details from cooies
  useEffect(()=>{
   checkAuth();
  },[])



  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

 
    <BrowserRouter >
      <Navbar/>
    <Routes>
      <Route path='/home' element={<Homepage/>}/>
      <Route path='/login' element={<Loginpage/>}/>
      <Route path='/signup' element={<Signuppage/>}/>
      <Route path='/dashbord' element={<Dashbordpage/>}/>
    </Routes>
  
  </BrowserRouter>
  </GoogleOAuthProvider>
  
)
}

export default App
