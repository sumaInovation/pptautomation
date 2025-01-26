import axios from "axios";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";
axios.defaults.withCredentials=true;
const useAuthStore=create((set)=>({
   user:null,
   isAuthtenicted:false,
   error:null,
   isLoading:false,
   isCheckingAuth:true,
   signup:async(details)=>{
    
      set({isLoging:true,error:null})
      try{
        
       const response= await axios.post(`${API_URL}/singup`,
        details,
        {withCredentials:true}
       )
       
       set({user:response.data.user,isAuthtenicted:true,isLoading:false});
      }catch(error){
        set({error:error.response.data.message,isLoading:false})
        throw error;//to catch error after run function

      }

   },
   login:async(details)=>{
   set({isLoading:true})
    try{
        const response= await axios.post(`${API_URL}/login`,
         details,
            {withCredentials:true}
           );
         
         set({isLoading:false})
         set({error:response.data.message});

         if (response.data.success) {
            return true;
          }
          throw new Error('Login failed');

    }catch(err){
         set({isLoading:false})
         set({error:err.response.data.message})
         throw new Error('Login failed');
    }




   },
   checkAuth:async()=>{//ckeck login user
//When Free request automatically cookies send to backend then back end send user details
     set({isCheckingAuth:true,error:null})
     try{
        const response= await axios.get(`${API_URL}/check-auth`,
        
            {withCredentials:true}
           );
        
        set({user:response.data.message.user,isCheckingAuth:false,isAuthtenicted:true});
        localStorage.setItem("auth_token", "your-token-here");
      
         
       

     }catch(err){
      localStorage.removeItem("auth_token");
         //set({error:err.response.data.message|| null,isCheckingAuth:false,isAuthtenicted:false});
        //throw err
     }
   }, 
   logout:async()=>{
      try{
         const response= await axios.get(`${API_URL}/logout`,
        
            {withCredentials:true}
           );
        
        set({user:null,isAuthtenicted:false});
        localStorage.removeItem("auth_token");

      }catch(err){
         set({error:err.response.message})
         throw err
      }
     

   }


}));


export default useAuthStore