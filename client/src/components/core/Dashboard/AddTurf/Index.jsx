import React from 'react'
import RenderStep from './RenderStep'

const RegisterTurf = () => {
  return (
    <div className=' mx-auto w-11/12 max-w-[1000px] py-10'>
    <div className='flex w-full items-start gap-x-6'>
        <div className='flex flex-1 flex-col'>
            <h1 className='mb-14 text-3xl font-medium text-richblack-5'>Registred Turf</h1>
            <RenderStep/>
        </div>
        <div className='sticky top-10 hidden max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-white p-6 xl:block'>
            <p className='mb-8 text-lg text-richblack-5'>⚡ Turf Registred Tips</p>
            <ul className='ml-5 list-item list-disc space-y-4 text-xs md:text-sm text-richblack-5'>
                <li>Please fill the turf name and write the correct description for the turf.</li>
                <li>Standard size for the Turf image is 1024x576.</li>
                <li>Please provide the complete address of the turf.</li>
                <li>Turf Builder is where you create and organize price and time of turf.</li>
                <li>Register a turf and view it in the 'My Turf' section.</li>

            </ul>
        </div>
    </div>
</div>
  )
}

export default RegisterTurf;