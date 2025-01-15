import React, { useEffect, useState } from 'react'
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';
const Cookie = () => {
  const[message,setMessage]=useState('no message')
  const function1=async()=>{
      try{

          
       const response= await axios.get('http://localhost:5000/set-cookie',
      {withCredentials:true}
       )
       setMessage(response.data.message);

      }catch(err){
       console.log('error: ',err);

      }
  }
  const function2=async()=>{
    try{

          
      const response= await axios.get('http://localhost:5000/get-cookie',
     {withCredentials:true}
      )
      setMessage(response.data.message);

     }catch(err){
      console.log('error: ',err);

     }
  }
  const function3=async()=>{
    try{

          
      const response= await axios.get('http://localhost:5000/delete-cookie',
     {withCredentials:true}
      )
      setMessage(response.data.message);

     }catch(err){
      console.log('error: ',err);

     }
  }
    
  
  return (
    <div className='text-6xl text-center mt-[80px]'>
    <h1>Welcome</h1>
    <button className='m-3 p-3' onClick={function1}>set-cookie</button>
    <button className='m-3 p-3'onClick={function2}>get-cookie</button>
    <button className='m-3 p-3'onClick={function3}>delete-cookie</button>
    <p>Text:{message}</p>
    
    </div>
  )
}

export default Cookie