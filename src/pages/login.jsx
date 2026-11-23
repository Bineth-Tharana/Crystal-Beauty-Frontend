import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react"
import toast from "react-hot-toast";
import { GrGoogle } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: (response)=>{
            const accessToken = response.access_token
            axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/login/google", {
                accessToken: accessToken
            }).then((response)=>{
                toast.success("Login successful")
                const token = response.data.token
                localStorage.setItem("token", token);
                if(response.data.role === "admin"){
                    navigate("/admin/")
                }
                else{
                    navigate("/")
                }
            }).catch((e)=>{
                console.error("Google login failed on the server:", e)
                toast.error(e.response?.data?.message || "Google login failed. Please try again.")
            })
        },
        // Google returned an error (for example access denied)
        onError: (error)=>{
            console.error("Google login error:", error)
            toast.error("Google login failed. Please try again.")
        },
        // popup was blocked or closed before finishing
        onNonOAuthError: (error)=>{
            console.error("Google popup problem:", error)
            toast.error("Google popup was blocked or closed. Please allow popups and try again.")
        }
    })

    async function handleLogin(){
        try{
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/login" , {
            email:email,
            password:password
            })
            toast.success("Login Successful");
            console.log(response.data);
            localStorage.setItem("token",response.data.token)
            
            if(response.data.role === "admin"){
                navigate("/admin/");
            }else{
                navigate("/");
            }
        }catch(e){
            toast.error(e.response?.data?.message || "Login failed. Please check your connection and try again.");
        }
    }

    return(
        <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex justify-evenly items-center">
            <div className="w-[50%] h-full">

            </div>
            <div className="w-[50%] h-full flex justify-center items-center">
                <div className="w-[500px] h-[600px] backdrop-blur-md rounded-[20px] shadow-xl flex flex-col justify-center items-center">
                    <input 
                    onChange={
                        (e)=>{
                            setEmail(e.target.value);
                        }
                    }

                    value={email}

                    placeholder="Email" className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[20px]" />
                    <input 
                    onChange={
                        (e)=>{
                            setPassword(e.target.value);
                        }
                    }
                    value={password}
                    type="password" placeholder="Password" className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] mb-[20px]" />
                    <button onClick={handleLogin} className="w-[300px] cursor-pointer h-[50px] bg-[#7B1252] hover:bg-[#5e0e3f] transition rounded-[20px] text-[20px] font-bold text-white my-[20px]">Login</button>
                    <button onClick={()=>googleLogin()} className="w-[300px] cursor-pointer h-[50px] flex justify-center items-center bg-white/90 hover:bg-white transition shadow-sm rounded-[20px] text-[20px] font-bold text-white my-[20px]">
                        <GrGoogle className="text-xl text-gray-600 cursor-pointer hover:text-gray-800" />
                        <span className="text-gray-600 text-xl font-semibold">Login with Google</span>
                    </button>

                    <Link to="/forget" className="text-sm font-semibold text-[#7B1252] underline hover:text-[#5e0e3f]">
                        Forgot password?
                    </Link>

                    <Link
                        to="/signup"
                        className="w-[300px] h-[50px] mt-[20px] flex justify-center items-center rounded-[20px] border-2 border-[#7B1252] bg-white/60 text-[#7B1252] text-[18px] font-bold hover:bg-[#7B1252] hover:text-white transition"
                    >
                        New here? Create an account
                    </Link>
                </div>
            </div>
        </div>
    )
}