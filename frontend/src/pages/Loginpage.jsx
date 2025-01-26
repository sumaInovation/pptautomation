import React, { useState } from "react";
import {GoogleLogin } from "@react-oauth/google";
import useAuthSrore from '../store/useAuthStore'
import { useNavigate } from "react-router-dom";
import {Loader } from "lucide-react";

const Login = () => {
  const navigate=useNavigate()
  const{login,isLoading,error}=useAuthSrore()
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin =async (e) => {

    
    e.preventDefault();
   // Add your API call for login here
    try{
       const details={
        email:formData.email,
        password:formData.password
       }
      await login(details);
        
      console.log('Login successful, navigating to dashboard');
    
      // After login, navigate to the dashboard
      navigate("/dashboard");
    }catch(err){

    }
  
  };

  const handleGoogleSuccess = async(response) => {
      const details={
        credential:response.credential
      }
    
  try{
        await login(details);
        navigate('/')
     }catch(error){
    //console.log('error google login')
    console.log(error);

  }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login
        </h2>

        {/* Google Login */}
        
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              text="signin_with"
            />
          </div>
        

        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Traditional Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="text-black mt-1 px-3 py-2 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="text-black mt-1 px-3 py-2 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Password"
              required
            />
          </div>
          <p className="text-black">{error?error:""}</p>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
           {isLoading?<Loader className={`w-10 h-10 text-green-100 animate-spin mx-auto size={24}`}/>:"Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account? <a href="/signup" className="text-blue-500">Signup</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
