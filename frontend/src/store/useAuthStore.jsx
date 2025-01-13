import axios from "axios";

import { create } from "zustand";
const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";
axios.defaults.withCredentials=true;
const useAuthStore=create((set)=>({
   user:null,
   isAuthtenicted:false,
   error:null,
   isLoading:false,
   isCheckingAuth:true,
   signup:async(email,password,name)=>{
      set({isLoging:true,error:null})
      try{
        
       const response= await axios.post(`${API_URL}/singup`,
        {email,password,name},
        {withCredentials:true}
       )
       
       set({user:response.data.user,isAuthtenicted:true,isLoading:false});
      }catch(error){
      set({error:error.response.data.message,isLoading:false})
        throw error;//to catch error after run function

      }

   },
   login:async(email,password)=>{
      console.log('called login function')
    set({isLoading:true})
    try{
        const response= await axios.post(`${API_URL}/login`,
            {email,password},
            {withCredentials:true}
           );
         console.log(response.data.message);
         set({isLoading:false})

    }catch(err){
        set({isLoading:false})
         set({error:err.response.data.message})
         throw err;
    }




   },
   checkAuth:async()=>{//ckeck login user
     set({isCheckingAuth:true,error:null})
     try{
        const response= await axios.get(`${API_URL}/check-auth`,
        
            {withCredentials:true}
           );
      
        set({user:response.data.message,isCheckingAuth:false,isAuthtenicted:true});
        console.log('user',user.name)
        

     }catch(err){
      
         set({error:err.response.data.message|| null,isCheckingAuth:false,isAuthtenicted:false});
        //throw err
     }
   }, 
   logout:async()=>{
      try{
         const response= await axios.get(`${API_URL}/logout`,
        
            {withCredentials:true}
           );
        
        set({user:response.data.message,isAuthtenicted:false});

      }catch(err){
         set({error:err.response.message})
         throw err
      }
     

   }


}));


export default useAuthStore