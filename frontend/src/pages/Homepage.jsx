import React, { useEffect } from 'react'
import useAuthStore from '../store/useAuthStore';
const Homepage = () => {
  const{user}=useAuthStore();
 
  return (
    <div className='text-6xl text-center'>
    {<h1>Welcome {user.name}</h1>}
    
    </div>
  )
}

export default Homepage