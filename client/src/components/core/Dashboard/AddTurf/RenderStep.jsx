import React from 'react'
import { FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import TurfInformationForm from './TurfInformation/TurfInformationForm';
import TurfBuilder from './TurfBuilder/TurfBuilder';
import RegisterTurf from './RegisterTurf/RegisterTurf';
const RenderStep = () => {

    const {step} = useSelector((state)=> state.turf);
    // const step=2;
    
    const steps = [
        {
            id:1,
            title: "Turf Information",
        },
        {
            id:2,
            title: "Turf Builder",
        },
        {
            id:3,     
            title: "Registering Turf",
        },
    ]

  return (
    <>
    <div className=' flex justify-center items-center'>
    <div className=' flex flex-col w-[calc(100vw-20%)] md:w-fit items-start'>
        <div className=' ml-10 relative mb-2 flex w-full justify-center'>
            {steps.map( (item) => (
                <div key={item.id} className=' flex w-full justify-between'>
                    <div className='flex flex-col items-center'>
                        <div className={  `grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${step === item.id 
                        ? "bg-green-500 border-green-500 text-black" 
                        : "border-richblack-700 bg-white-800 text-red-500"}`}>
                        {
                            step > item.id ? (<FaCheck/>) :(item.id)
                        }
                        </div>
                    </div>
                    {item.id <3 && (
                    <div className={`h-[calc(34px/2)] w-[100%]  border-dashed border-b-2 ${step > item.id ? "border-green-500" : "border-black"}
                    }`}></div>
                    )}
                </div>
            ) )}
        </div>
        <div className='relative mb-16 flex w-full select-none justify-between'>
            {steps.map((item) => (
                <>
                    <div key={item.id} className='flex md:min-w-[180px] flex-col items-start'>
                        <p className=' ml-3 md:ml-0 text-[10px] md:text-sm text-richblack-5'>{item.title}</p>
                    </div>
                </>
            ))}
        </div>
        </div>
    </div>

        {step === 1 && <TurfInformationForm />}
        {step === 2 && <TurfBuilder/>}
        {step===3 && <RegisterTurf/>}
    </>
  )
}

export default RenderStep;