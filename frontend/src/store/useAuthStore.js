import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore=create((set)=>({
    authUser:null,
    isSigningUp:null,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],

    checkAuth: async()=>{
        try{
        const res=await axiosInstance.get("/auth/check")

        set({authUser:res.data})
        }catch(error){
            console.log("error in checkAuth",error)
        set({authUser:null})
       
        }finally{
        set({isCheckingAuth:false})
        }
    },

    // signup:async(data)=>{
    //     set({ isSigningUp:true});
    //    try{
    //     const res=await axiosInstance.post("/auth/signup",data);
    //     set({ authUser:res.data})
    //     toast.success("Acoount created successfully");
       

    //    }catch(error){
    //     toast.error(error.response.data.message );
      
    //    }finally{
    //     set({ isSigningUp:false});
    //    }
    // }
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            console.error("Signup error:", error.response || error);
            toast.error(error.response?.data?.message || "An unexpected error occurred");
        } finally {
            set({ isSigningUp: false });
        }
    }   , 
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("http://localhost:5001/api/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully!");
        } catch (error) {
          toast.error(error.response?.data?.message || "Login failed!");
        } finally {
          set({ isLoggingIn: false });
        }
      },

      
  
      logout: async () => {
        try {
          const response = await fetch("http://localhost:5001/api/auth/logout", {
            method: "POST",
            credentials: "include", // Allow cookies to be sent with the request
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Logout failed");
          }
      
          set({ authUser: null }); // Reset user on successful logout
          toast.success("Logged out successfully");
          get().disconnectSocket(); // Disconnect socket if applicable
        } catch (error) {
          toast.error(error.message);
        }
      },      
      
      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const response = await fetch("http://localhost:5001/api/auth/update-profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for authentication
            body: JSON.stringify(data),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update profile");
          }
      
          const resData = await response.json();
          set({ authUser: resData });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("Error in update profile:", error.message);
          toast.error(error.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
    

}))