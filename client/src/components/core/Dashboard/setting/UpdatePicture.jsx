import React from 'react'
import { updatePfp } from '../../../../services/operation/profileAPI';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function UpdatePicture() {
    //update profile picture
    const pfp = useSelector(state => state.profile.profileImage);
    const [profilePicture, setprofilePicture] = useState(pfp)
    const token = useSelector(state => state.auth.token);


    const handleUpload = (e) => {
        e.preventDefault();
        const file = e.target[0].files[0];
        updatePfp(token, file);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setprofilePicture(URL.createObjectURL(file));
    }
    return (
        <div>
            <div className='flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 md:p-8 md:px-12 px-3 py-3 text-richblack-5'>
                <div className='flex items-center gap-x-4'>
                    <img className='aspect-square w-[78px] rounded-full object-cover' src={profilePicture}></img>
                    <div className='space-y-2'>
                        <p>Change Profile Picture</p>
                        <form onSubmit={handleUpload}>
                            <div className='flex flex-row gap-3'>
                                <label className="cursor-pointer rounded-md bg-neutral-200 md:py-2 md:px-5 px-4 py-2 font-semibold text-richblack-50" htmlFor="upload">Select
                                    <input id='upload' type="file" onChange={handleFileChange} className="hidden" accept="image/png, image/gif, image/jpeg" />
                                </label>
                                <button type='submit' className='flex items-center bg-green-500 px-4 py-2 cursor-pointer gap-x-2 rounded-md md:py-2 md:px-5  font-semibold text-richblack-900 undefined'>Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
