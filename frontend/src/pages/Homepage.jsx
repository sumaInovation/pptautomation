import React, { useEffect } from 'react'
 import useAuthStore from '../store/useAuthStore';
const Homepage = () => {
  const{user,checkAuth,isAuthtenicted,logout}=useAuthStore();

  return (
    <div className='mt-[80px]'>
    
     

    </div>
  )
}

export default Homepage
