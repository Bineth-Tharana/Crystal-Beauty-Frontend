import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgetPasswordPage(){
    const [otpSent, setotp] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function sendOtp(){
        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/send-otp", {
            email: email
        }).then((response)=>{
            setotp(true);
            toast.success("OTP sent to your email Check your inbox");
            console.log(response.data);
        }).catch((error) =>{
            toast.error("Failed to send OTP");
            console.log(error);
        })
    }

    function verifyOtp(){
        const otpInNumberFormat = parseInt(otp, 10);
        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/reset-password", {
            email: email,
            otp: otpInNumberFormat,
            newPassword: newPassword
        }).then((response)=>{
            toast.success("OTP verified successfully");
            console.log(response.data);
        }).catch((error) =>{
            toast.error("Invalid OTP");
            console.log(error);
        })
    }

    return(
        <div className="w-full h-screen flex justify-center items-center bg-[url('/login.jpg')] bg-center bg-cover">
            {
                otpSent?
                <div className="w-[400px] h-[500px] bg-white shadow-2xl rounded-xl flex flex-col justify-center items-center p-4">
                    <input
                        type="text"
                        placeholder="Enter your OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none"
                    />
                    <button
                        onClick={verifyOtp}
                        className="w-full h-[50px] bg-accent text-white rounded-lg mb-4 hover:bg-secondary transition-all duration-300"
                    >
                        Verify OTP
                    </button>
                    <button className="w-full h-[50px] bg-gray-300 text-gray-700 rounded-lg mb-4 hover:bg-gray-400 transition-all duration-300" onClick={()=>setotp(false)}>Resend OTP</button>
                </div>    
                :
                <div className="w-[400px] h-[500px] bg-white shadow-2xl rounded-xl flex flex-col justify-center items-center p-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none"
                    />
                    <button
                        onClick={sendOtp}
                        className="w-full h-[50px] bg-accent text-white rounded-lg mb-4 hover:bg-secondary transition-all duration-300"
                    >
                        Send OTP
                    </button>
                </div>
            }

        </div>
    )
}