import React from 'react'
import { setEditTurf , setStep,setPriceTime,setTurf} from '../../../../../slices/turfSlice';
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineArrowBack } from "react-icons/md";
import {useNavigate} from "react-router-dom";
import toast from 'react-hot-toast';
import { RemovedTurf } from '../../../../../services/operation/TurfDetailsAPI';

export default function RegisterTurf() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {priceTime,turf}=useSelector((state)=>state.turf);
    const {token}=useSelector((state)=>state.auth);

    const backHandler=()=>{
        dispatch(setStep(2));
        dispatch(setEditTurf(true));
        console.log("pricetime in back: ",priceTime);
    }

    const registerHandler=()=>{
      toast.success("Turf has been registered.")
      navigate("/dashboard/my-turfs");
      setTurf(null);
      setPriceTime(null);
      dispatch(setStep(1));
    }

    const cancleHandler = async()=>{
      navigate("/dashboard/my-profile");
      const newData = {  turfId: turf._id };
      await RemovedTurf(newData,token);
      setPriceTime(null);
      setTurf(null);
      dispatch(setStep(1));

    }
  return (
    <div>
      <div className='md:w-2/3 w-full py-5 rounded-md flex justify-center mb-6 gap-20 bg-white p-4 md:ml-16'>

        <button className='bg-red-500 rounded-md px-3 py-2' onClick={cancleHandler}>Cancel</button>
        <button className='bg-green-500 rounded-md px-3 py-2' onClick={registerHandler}> 
          Register
        </button>
      </div>

        <button onClick={backHandler} className='mt-5 flex gap-2 bg-green-500 px-3 py-2 rounded-md justify-center items-center'>
          <span><MdOutlineArrowBack></MdOutlineArrowBack></span>
          <p>Back</p>
        </button>
    </div>
  )
}
