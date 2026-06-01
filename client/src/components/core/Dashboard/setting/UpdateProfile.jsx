import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateAdditionalDetails } from '../../../../services/operation/profileAPI';
export default function UpdateProfile() {

    const token = useSelector(state => state.auth.token);
    const user=useSelector(state=>state.profile.user);

    //update additional info
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
    })

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const handelAdditionalDetails = (e) => {
        e.preventDefault()
        updateAdditionalDetails(token, formData);
    }
    return (
        <div>
            <form onSubmit={handelAdditionalDetails}>
                <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                    <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>
                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="firstName" className=" text-richblack-50">First Name</label>
                            <input defaultValue={user.firstName || null} type="text" name="firstName" id="firstName" placeholder="Enter first name" className="form-style p-2" onChange={handleOnChange} />
                        </div>
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="lastName" className="text-richblack-50">Last Name</label>
                            <input defaultValue={user.lastName || null} type="text" name="lastName" id="lastName" placeholder="Enter first name" className="form-style p-2" onChange={handleOnChange} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2"><button className="flex items-center bg-green-500 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined" type="submit">Save</button></div>
            </form>

        </div>
    )
}
