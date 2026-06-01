import React from 'react'
import DeleteAccount from './DeleteAccount';
import UpdateProfile from './UpdateProfile';
import UpdatePassword from './UpdatePassword';
import UpdatePicture from './UpdatePicture';

const Index = () => {

  return (
    <div>
      <div className=' flex-1 overflow-auto'>
        <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Profile</h1>
       
        {/* update profile picture  */}
        <UpdatePicture></UpdatePicture>

        {/* Update Profile Details  */}
        <UpdateProfile></UpdateProfile>

        {/* update password  */}
        <UpdatePassword></UpdatePassword>

        {/* Delete Account */}
        <DeleteAccount></DeleteAccount>

       </div>
      </div>
    </div>
  )
}

export default Index;