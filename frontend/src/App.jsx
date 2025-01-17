import React, { useState, useEffect, Children } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DataProvider } from './context/useTableContext';
import Analysispage from './pages/Tableanalyspage';
import Dashbordpage from './pages/Dashbordpage';
import Loginpage from './pages/Loginpage'
import Signuppage from './pages/Signuppage';
import Navbar from './components/common/Navbar'
import useAuthSrore from './store/useAuthStore'
import Overviwepage from './pages/Overviwepage'
import MachineDataForm from './pages/filterdata'
import Analytics from './pages/Analytics'
import Technicalreport from './pages/Technicalreportpage'
const App = () => {
  const{checkAuth}=useAuthSrore()
//Ever Re-rendering get user details from cooies
  useEffect(()=>{
   checkAuth();
  },[checkAuth])



  return (
    <DataProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

    
    <BrowserRouter >
      <Navbar/>
    <Routes>
      <Route path='/' element={<Overviwepage/>}/>
      <Route path='/login' element={<Loginpage/>}/>
      <Route path='/signup' element={<Signuppage/>}/>
      <Route path='/dashboard' element={<Dashbordpage/>}/>
      <Route path='/report' element={<MachineDataForm/>}/>
      <Route path='/analys' element={<Analysispage/>}/>
      <Route path='/analytics' element={<Analytics/>}/>
      <Route path='/technical' element={<Technicalreport/>}/>
    </Routes>
  
  </BrowserRouter>
  </GoogleOAuthProvider>
  </DataProvider>
)
}

export default App
