import React, { useState, useEffect, Children } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage'
import Dashbordpage from './pages/Dashbordpage';
import Loginpage from './pages/Loginpage'
import Signuppage from './pages/Signuppage';
import useAuthStore from './store/useAuthStore';
const App = () => {
   

  const{checkAuth,isAuthtenicted,user}=useAuthStore();
  useEffect(()=>{
    checkAuth();
 },[checkAuth]);



  return (
    <BrowserRouter >
      
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/login' element={<Loginpage/>}/>
      <Route path='/signup' element={<Signuppage/>}/>
      <Route path='/dashbord' element={<Dashbordpage/>}/>
    </Routes>
  
  </BrowserRouter>

)
}

export default App
