import React, { useState, useEffect, Children } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage'
import Dashbordpage from './pages/Dashbordpage';
import Loginpage from './pages/Loginpage'
import Signuppage from './pages/Signuppage';
import Navbar from './components/common/Navbar'
const App = () => {
   

  



  return (
    <BrowserRouter >
      <Navbar/>
    <Routes>
      <Route path='/home' element={<Homepage/>}/>
      <Route path='/login' element={<Loginpage/>}/>
      <Route path='/signup' element={<Signuppage/>}/>
      <Route path='/dashbord' element={<Dashbordpage/>}/>
    </Routes>
  
  </BrowserRouter>

)
}

export default App
