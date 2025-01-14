import React, { useEffect } from 'react'
import useAuthStore from '../store/useAuthStore';
const Homepage = () => {
  const{}=useAuthStore();
 useEffect(()=>{


 })
  return (
    <div className='text-6xl text-center'>
    <h1>Welcome</h1>
    
    </div>
  )
}

export default Homepage