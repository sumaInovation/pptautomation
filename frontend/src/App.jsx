import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DataProvider } from './context/useTableContext';
import Analysispage from './pages/Tableanalyspage';
import Dashbordpage from './pages/Dashbordpage';
import Loginpage from './pages/Loginpage';
import Signuppage from './pages/Signuppage';
import Navbar from './components/common/Navbar';
import Overviwepage from './pages/Overviwepage';
import MachineDataForm from './pages/filterdata';
import Analytics from './pages/Analytics';
import Technicalreport from './pages/Technicalreportpage';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

const App = () => {
  return (
    <DataProvider>
      {/* <GoogleOAuthProvider clientId="39253442113-0vh548enso8si0f1pjg27cbensc6qpba.apps.googleusercontent.com"> */}
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Overviwepage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/signup" element={<Signuppage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashbordpage />
                </PrivateRoute>
              }
            />
            <Route
              path="/report"
              element={
                <PrivateRoute>
                  <MachineDataForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/analys"
              element={
                <PrivateRoute>
                  <Analysispage />
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <Analytics />
                </PrivateRoute>
              }
            />
            <Route
              path="/technical"
              element={
                <PrivateRoute>
                  <Technicalreport />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </DataProvider>
  );
};

export default App;
