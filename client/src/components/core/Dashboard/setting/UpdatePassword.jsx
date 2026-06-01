import React from 'react'
import { useState } from 'react';
import { updatePassword } from '../../../../services/operation/profileAPI';
import {AiOutlineEyeInvisible} from 'react-icons/ai'
import {AiOutlineEye} from 'react-icons/ai';
import { useSelector } from 'react-redux';


export default function UpdatePassword() {

    const token= useSelector(state=>state.auth.token);

    //update password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword,setConfirmPassword]=useState(false);
    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
    })

    const handleOnChangePassword = (e) => {
        setPassword((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const handlePassword = (e) => {
        e.preventDefault()
        updatePassword(token, password);

    }
    return (
        <div>
            <form onSubmit={handlePassword}>
                <div >
                    <div className=' relative mt-4'>
                        <label className="w-full"><p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Old Password <sup className="text-pink-200">*</sup></p>
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                name="oldPassword"
                                value={password.oldPassword}
                                onChange={handleOnChangePassword}
                                placeholder="Enter Password"
                                style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                }}
                                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
                            /></label>
                        <span
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-9 z-[10] cursor-pointer"
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" color="white" className='' />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" color="white" />
                            )}
                        </span>
                    </div>
                    <div className=' relative mt-4'>
                        <label className="w-full"><p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">New Password <sup className="text-pink-200">*</sup></p>
                            <input
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                name="newPassword"
                                value={password.newPassword}
                                onChange={handleOnChangePassword}
                                placeholder="Enter Password"
                                style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                }}
                                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
                            /></label>
                        <span
                            onClick={() => setConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-9 z-[10] cursor-pointer"
                        >
                            {showConfirmPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" color="white" className='' />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" color="white" />
                            )}
                        </span>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-3"><button className="flex items-center bg-green-500 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined" type="submit">Save</button></div>
            </form>
        </div>
    )
}
