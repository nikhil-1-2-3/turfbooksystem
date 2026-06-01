import loginImg from "../assets/images/signupImg.jpeg";
import Template from "../components/core/auth/Template";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TbCornerDownRightDouble } from "react-icons/tb"
import { BsLightningChargeFill } from "react-icons/bs";
import { login } from "../services/operation/authApi";




function Login() {
    const [showDemo, setShowDemo] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    <>
    {/* test login ID */}
    <div  className={`${showDemo ? "":"hidden"} justify-center items-center absolute bg-green-300 top-52 md:top-32 md:right-[50%] right-[10%] p-6 -rotate-[20deg] z-20 `}>
        <div className="flex flex-col gap-2 relative">
            <div onClick={()=>{setShowDemo(false)}} className="absolute top-[-30px] right-[-20px] text-5xl rounded-full w-[40px] h-[40px] flex justify-center items-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="20" height="20">
                    <circle cx="50" cy="50" r="45" fill="#888888" stroke="#000000" strokeWidth="2" />
                    <circle cx="50" cy="50" r="20" fill="#ffffff" />
                </svg>

            </div>
            <div className=" gap-y-2 flex flex-col">
                <p className="text-2xl font-extrabold flex items-center">Take a Demo &nbsp; <BsLightningChargeFill size={20}/></p>
                <div>
                    <button onClick={
                    () => {
                        dispatch(login("demoowner@gmail.com", "12345", navigate)
                    )}
                    } className="bg-white font-semibold mt-4 mb-1 px-4 py-2 rounded-md flex">
                    <TbCornerDownRightDouble className="text-2xl hidden md:block"/>
                    Click here for Owner Demo</button>
                </div>
                <div>
                    <button onClick={
                    () => {
                        dispatch(login("demouser@gmail.com", "12345", navigate)
                    )}
                    } className="bg-white font-semibold px-4 py-2 rounded-md flex">
                    <TbCornerDownRightDouble className="text-2xl md:block hidden"/>
                    Click here for Customer Demo</button>
                </div>
            </div>
        </div>
    </div>
            <Template
                title="Welcome Back"
                description1="Build skills for today, tomorrow, and beyond."
                description2="Where passion meets performance."
                image={loginImg}
                formType="login"
            />
        </>
    )
}

export default Login