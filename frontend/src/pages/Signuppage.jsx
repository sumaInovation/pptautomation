import React, { useState } from "react";
import useAuthSrore from '../store/useAuthStore'
import { useNavigate } from "react-router-dom";
import {Loader } from "lucide-react";
const Signuppage = () => {
  const{signup,isLoading,error}=useAuthSrore()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate=useNavigate();

  const handleInputChange = (e) => {//here name is parameter email,password,name
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async(e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add your API call for signup here
    try{
      
       await signup(formData.email,formData.password,formData.name);//email,password,name
       navigate('/login');
       
    }catch(err){
    
      
    }
  };

 

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Signup
        </h2>

        

        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Traditional Signup Form */}
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="text-black mt-1 px-3 py-2 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Name"
              required
            />
          </div>

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
            {isLoading?<Loader className={`w-10 h-10 text-green-100 animate-spin mx-auto size={24}`}/>:"Signup"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signuppage;
