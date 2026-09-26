import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterPage(){

    const [email,setEmail] = useState("");
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    async function handleRegister(){

        try{

            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users",
                {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: password
                }
            );

            toast.success("Registration Successful");

            console.log(response.data);

            navigate("/login");

        }catch(e){

            toast.error(e.response.data.message);

        }

    }

    return(
        <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex justify-evenly items-center">

            <div className="w-[50%] h-full">

            </div>

            <div className="w-[50%] h-full flex justify-center items-center">

                <div className="w-[500px] h-[700px] backdrop-blur-md rounded-[20px] shadow-xl flex flex-col justify-center items-center">

                    <input
                        type="text"
                        placeholder="First Name"
                        onChange={(e)=>{
                            setFirstName(e.target.value);
                        }}
                        value={firstName}
                        className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-[20px]"
                    />

                    <input
                        type="text"
                        placeholder="Last Name"
                        onChange={(e)=>{
                            setLastName(e.target.value);
                        }}
                        value={lastName}
                        className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-[20px]"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e)=>{
                            setEmail(e.target.value);
                        }}
                        value={email}
                        className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-[20px]"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e)=>{
                            setPassword(e.target.value);
                        }}
                        value={password}
                        className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-[20px]"
                    />

                    <button
                        onClick={handleRegister}
                        className="w-[300px] cursor-pointer h-[50px] bg-[#c3efe9] rounded-[20px] text-[20px] font-bold text-white my-[20px]"
                    >
                        Register
                    </button>

                </div>

            </div>

        </div>
    )
}


